'use strict';

// load the modules
const _model = require('../lib/model');
const debug = require('debug')('schedule:capacity')

/**
 * The condition used in the search on the states. Return true or false depending on whether
 * the condition is fulfilled or not.
 *
 * changeValue - the value of the change to be applied
 * bound - the state value upper bound
 *
 * returns - a function to be evaluated
 **/
const condition = (changeValue, bound) => {
  return (item, index, timeline) => ((item.value + changeValue >= 0) && (item.value + changeValue <= bound));
};

/**
 * The policy defining how to book the tasks changes from the actor states
 **/
function charge(actor, action) {

  // in capacity planning the time ordering of the changes is essential
  action.changes.sort((a, b) => (a.time - b.time));

  const states2Compact = [];

  action.changes.forEach((change, index) => {

    const state = actor.state(change.state);
    const value = state.getAt(change.time);

    // set value at change time
    if (value.time === change.time)
      value.value = value.value + change.value
    else
      state.setValue(change.time, value.value + change.value);

    // update future values
    const head = state.getHead(change.time);
    head.forEach((item, index) => {
      if (item.time > change.time)
        item.value = item.value + change.value;
    });
    states2Compact.push(state);
  });
  // compact all states touched by the changes of the action
  states2Compact.forEach(item => item.compact());
};

/**
 * TBD: Refactor such, that no update of states is required
 * The policy defining how to release the task changes from the actor states
 *
 * @actor - the actor to release the action from
 * @action - the action to be released
 *
 **/
function release(actor, action) {

  // in capacity planning the time ordering of the changes is essential
  action.changes.sort((a, b) => (a.time - b.time));

  const states2Compact = [];

  debug('Release action \'%s\' from actor \'%s\'.', action.name, actor.name);

  action.changes.forEach((change, index) => {

    const state = actor.state(change.state);
    const value = state.getAt(change.time);

    if (value.time === change.time)
      value.value = value.value - change.value;
    else
      state.setValue(change.time, value.value - change.value);

    // update future values
    const head = state.getHead(change.time);
    head.forEach((item, index) => {
      if (item.time > change.time)
        item.value = item.value - change.value;
    });
    states2Compact.push(state);
  });
  // compact all states touched by the changes of the action
  states2Compact.forEach(item => item.compact());

};


/**
 * A scheduling algorithm for planning problems with a capacity tracking
 * on the actors states.
 *
 * @actor - the actor of the world model this algorithm is applied to.
 * @action - the action to be scheduled on the actor
 * @time - the target time to start the schedule
 **/
function scheduleASAP(actor, action, time) {

  if (!time) {
    debug('ERROR in Capacity Planning: Stopped since time is undefined');
    return undefined;
  }

  // by contract the action must serve the quantity and the duration in the target
  let quantity = action.target.quantity;
  let duration = action.target.duration;

  // get the capacity state
  const state = actor.state('capacity');
  const bound = state.bound;

  // by contract we make a consume or produce, if the duration is zero
  if (duration === 0) {

    const start = state.searchASAP(time, condition(quantity, bound));

    // bookkeeping
    if (start) {
      action.buildChange('capacity', quantity, start);
      action.start = start;
      action.end = start;
    }

  } else {

    let start = state.jamASAP(time, condition(quantity, bound), duration);

    // bookkeeping
    if (start) {
      action.buildChange('capacity', quantity, start);
      action.buildChange('capacity', -quantity, start + duration);
      action.start = start;
      action.end = start + duration;
    }

  }

  debug('Scheduled action \'%s\' to actor \'%s\' from start %s to end %s in ASAP mode',
    action.name, actor.name, action.start, action.end);

}; // scheduleASAP


/**
 * A simple scheduling algorithm for planning problems with a capacity tracking
 * on the actors states.
 *
 * @actor - the actor of the world model this algorithm is applied to.
 * @action - the action to be scheduled on the actor
 * @time - the target time to end the schedule
 **/
function scheduleJIT(actor, action, time) {

  if (!time) {
    debug('ERROR in Capacity Planning: Stopped since time is undefined');
    return undefined;
  }

  // by contract the action must serve the quantity and the duration in the target
  let quantity = action.target.quantity;
  let duration = action.target.duration;

  // get the capacity state
  const state = actor.state('capacity');
  const bound = state.bound;

  // by contract we make a consume or produce, if the duration is zero
  if (duration === 0) {

    const end = state.searchJIT(time, condition(quantity, bound));

    // bookkeeping
    if (end) {
      action.buildChange('capacity', quantity, end);
      action.start = end;
      action.end = end;
    }

  } else {

    let end = state.jamJIT(time, condition(quantity, bound), duration);

    // bookkeeping
    if (end) {
      action.buildChange('capacity', quantity, end - duration);
      action.buildChange('capacity', -quantity, end);
      action.start = end - duration;
      action.end = end;
    }

  }

  debug('Scheduled action \'%s\' to actor \'%s\' from start %s to end %s in JIT mode',
    action.name, actor.name, action.start, action.end);

}; // scheduleJIT


/**
 * A wrapper function to schedule according to the mode set.
 *
 * @actor - the actor to schedule to
 * @action - the action to schedule
 * @time - the scheduling target time. The latest end for JIT or the earliest start for ASAP.
 * @mode - either 'JIT' or 'ASAP'
 **/
function schedule(actor, action, time, mode) {

  if (mode === 'JIT') {
    return scheduleJIT(actor, action, time);
  } else if (mode === 'ASAP') {
    return scheduleASAP(actor, action, time);
  } else {
    debug('ERROR: Unknown mode %s', mode);
  }
}

// the module definition
module.exports = {

  charge: function(actor, action) {
    return charge(actor, action);
  },
  release: function(actor, action) {
    return release(actor, action);
  },
  schedule: function(actor, action, time, mode) {
    return schedule(actor, action, time, mode);
  }

};
