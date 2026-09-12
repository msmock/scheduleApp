/**
 * the core library used for scheduling
 */
'use strict';
const debug = require('debug')('schedule:model')

/**
 * The container keeping all together
 **/
var Container = (function() {

  var instance;

  function createInstance() {
    const object = new Object("Agent");
    object.actors = new Map(); // think of resources in capacity planning
    object.activities = new Map(); // think of processes in manufacturing
    object.algoritm = new Map(); // sort of dependency injection container
    return object;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };

})();


/**
 * scheduling uses states whose values evolve in time.
 **/
class Value {

  /**
   * time - the time stamp of the timed value
   * value - an arbitrary object. By contract this must match the change definition on same state.
   **/
  constructor(time, value) {
    this.type = this.constructor.name;
    this.time = time;
    this.value = value;
  }
}

/**
 * scheduling uses states whose values evolve in time due to changes.
 **/
class Change {

  /**
   * value - By contract this must match the value definition on same state.
   * state - the name of the state the change must be applied to.
   * time - the time the change is scheduled to.
   **/
  constructor(state, value, time) {
    this.type = this.constructor.name;
    this.state = state;
    this.value = value;
    this.time = time;
  }
}

/**
 * the main acting objects we want to schedule to
 **/
class Actor {

  constructor(name) {
    this.type = this.constructor.name;
    this.name = name;
    this.states = [];
  }

  buildState(name) {
    const state = new State(name);
    this.states.push(state);
    return state;
  }

  state(name) {
    return this.states.find(item => (item.name === name));
  }

}

/**
 * class for time based states
 **/
class State {

  constructor(name) {
    this.type = this.constructor.name;
    this.name = name;
    this.timeline = [];
  }

  /**
   * Set a value at a certain point in time
   *
   * @time - the unix time in milliseconds as number
   * @value - an arbitrary object by contract (not to be confused with the value object declared above)
   **/
  setValue(time, value) {

    const item = new Value(time, value);

    // find first item whose time is later or equal to the time point
    const match = this.timeline.find(item => (item.time >= time));

    if (!match)
      this.timeline.push(item); // just add, if no later item found
    else if (match.time === item.time)
      match.value = item.value; // set the target value if we find one at exact time
    else
      this.timeline.splice(this.timeline.indexOf(match), 0, item); // insert a new value object
       
    return item;
  }

  /**
   * Get the state at a certain time.
   * @time - the time
   * @returns - the value object
   **/
  getAt(time) {
    let result = undefined;
    for (let item of this.timeline) {
      if (item.time <= time)
        result = item;
      else
        return result;
    }
    return result;
  }

  /**
   * compacts the values by eliminating adjacent items with same value
   * TBD: should be part of the setValue function
   **/
  compact() {
    const reduced = [];
    let predecessor = undefined;
    this.timeline.forEach((item, index) => {
      if (!predecessor || !(predecessor.value === item.value)) {
        reduced.push(item);
        predecessor = item;
      }
    });
    this.timeline = reduced;
  }

  /**
   * Get the part of the timeline in the future.
   **/
  getHead(time) {
    let head = this.timeline.filter((item) => (item.time >= time));
    head.unshift(this.getAt(time));
    return head;
  }

  /**
   * Get the part of the timeline in the past
   **/
  getPast(time) {
    return this.timeline.filter((item) => (item.time <= time));
  }

  /**
   * This solves a common scheduling problem to apply a change to the state
   * at a certain time looking ahead where the condition can be fulfilled.
   *
   * Returns the time ahead the change can be played not violating the condition.
   *
   * @time - the unix time in millis to start the search from.
   * @condition - a function which defines the match condition.
   * @returns - the time ahead or undefined, if no time was found.
   **/
  searchASAP(time, condition) {
    // search forward in time until the change fits
    const head = this.getHead(time);
    const match = head.find(condition);

    // return the time we can play the change, or undefined otherwise
    return match ? Math.max(match.time, time) : undefined;
  }

  /**
   * This solves a common scheduling problem to apply a change to the state
   * at a certain time looking backward in time where the condition can be fulfilled.
   *
   * Returns the JIT time the change can be played not violating the condition.
   *
   * @time - the unix time in millis to start the search from.
   * @condition - a function which defines the match condition.
   * @returns - the JIT time found or undefined, if no time was found.
   **/
  searchJIT(time, condition) {
    // else, search backward in time until the change fits
    let matched = false;
    const past = this.getPast(time).reverse();

    for (let item of past) {
      if (!condition(item)) {
        time = item.time;
      } else {
        matched = true;
        break;
      }
    }
    return matched ? time : undefined;
  }

  /**
   * This solves a common scheduling problem to look forward in time for a time interval
   * with a given duration to block an actor state.
   *
   * Returns the time ahead the actor state can be blocked without violating the condition.
   *
   * @time - the unix time in millis to start the search from.
   * @condition - a function which defines the match condition.
   * @duration - the duration of the interval to be blocked.
   *
   * @return - the start time of the interval or undefined, if no time was found.
   **/
  jamASAP(time, condition, duration) {

    debug('Jam ASAP from time %s with duration %s', time, duration);

    const head = this.getHead(time);
    debug('Head searching from time %s is %s', time, JSON.stringify(head));

    let startCandidate = time; // the earliest possible start

    head.forEach((item, index) => {

      if (!condition(item) && item.time < startCandidate + duration) {

        const sucessor = head[index + 1];
        if (sucessor)
          startCandidate = sucessor.time;
        else
          startCandidate = undefined;
      }

    });

    debug('return start candiate ' + startCandidate);
    return startCandidate;
  }

  /**
   * This solves a common scheduling problem to look backward in time for a time interval
   * with a given duration to block an actor state.
   *
   * Returns the time in the past the actor state can be blocked without violating the condition.
   *
   * @time - the unix time in millis to start the search from as targeted end.
   * @condition - a function which defines the match condition.
   * @duration - the duration of the interval to be blocked
   *
   * @return - the end time of the interval or undefined, if no time was found.
   *
   **/
  jamJIT(time, condition, duration) {

    debug('Jam JIT from time %s with duration %s', time, duration);

    const past = this.getPast(time).reverse();
    debug('Past searching from time %s is %s', time, JSON.stringify(past));

    let endCandidate = time; // the latest possible end

    past.forEach((item, index) => {

      if (condition(item) && item.time > endCandidate - duration) {

        // condition is fullfilled
        const predecessor = past[index + 1];
        if (predecessor && !condition(predecessor)) {
          endCandidate = predecessor.time;
        }

      } else if (!condition(item) && item.time > endCandidate - duration) {
        endCandidate = item.time;
      }

    });

    debug('return end candiate ' + endCandidate);
    return endCandidate;

  }

}

/**
 * the main object defining a hierarchical collection of actions
 **/
class Activity {

  /**
   * @name - the name to identify the activity
   * @ordering - indicator for the branch (or gateway type). Indicates whether the child elements
   *      must be time ordered (each after each other), or can be scheduled parallel.
   **/
  constructor(name, ordering) {
    this.type = this.constructor.name;
    this.name = name;
    this.locator = name;
    this.ordering = ordering;
    this.start = undefined;
    this.end = undefined;
    this.path = name;
    this.children = [];
  }

  /**
   * factory method to build a child action
   *
   * @name - the name to identify the activity
   * @actor - the actor name the task shall be scheduled to
   * @target - an object modelling the target to reach of the action
   **/
  buildAction(name, actor, target) {
    const action = new Action(name, actor, target);
    action.locator = this.locator + '/' + name;
    this.children.push(action);
    return action;
  }

  /**
   * factory function to build a child activity
   *
   * @name - the name to identify the activity
   * @ordering - indicator for the branch (or gateway type). Indicates whether the child elements
   *      must be time ordered (each after each other), or can be scheduled parallel.
   **/
  buildActivity(name, ordering) {
    const activity = new Activity(name, ordering);
    activity.locator = this.locator + '/' + name;
    this.children.push(activity);
    return activity;
  }

  /**
   * update the start and end timestamps
   **/
  update(item) {
    this.start = (this.start) ? Math.min(this.start, item.start) : item.start;
    this.end = (this.end) ? Math.max(this.end, item.end) : item.end;
  }

  /**
   * depth search for actions of this activity
   **/
  actions() {
    let result = [];
    for (let item of this.children) {
      if (item.type === 'Action') {
        result.push(item);
      } else if (item.type === 'Activity') {
        let actions = item.actions();
        for (let action of actions) {
          result.push(action);
        }
      }
    }
    return result;
  }

}

/**
 * a single atomic step within an activity.
 **/
class Action {

  /**
   * @name - the action name
   * @actorOptions - an array of actor names to try to schedule this action to
   * @target - an object modelling the target to reach of the action
   **/
  constructor(name, actorOptions, target) {
    this.type = this.constructor.name;
    this.name = name;
    this.locator = undefined;
    this.target = target;
    this.actorOptions = actorOptions; // list of actors which can perfom the action
    this.actorChosen = undefined; // the actor chosen durcing scheduling
    this.start = undefined;
    this.end = undefined;
    this.changes = [];
  }

  /**
   * factory function add a change to the action
   *
   * @state - the name of the actor state to apply the change to.
   * @value - the value of the change.
   * @time - the value of the change.
   **/
  buildChange(state, value, time) {
    const change = new Change(state, value, time);
    this.changes.push(change);
    return change;
  }

  // add a change
  pushChange(change) {
    this.changes.push(change);
  }

}


// the module definition
module.exports = {

  createValue: function(time, value) {
    return new Value(time, value);
  },
  createChange: function(state, value, time) {
    return new Change(state, value, time);
  },
  createActor: function(name) {
    return new Actor(name);
  },
  createState: function(name) {
    return new State(name);
  },
  createActivity: function(name, ordering) {
    return new Activity(name, ordering);
  },
  createAction: function(name, actor, target) {
    return new Action(name, actor, target);
  },
  getContainer: function() {
    return Container.getInstance();
  }

};
