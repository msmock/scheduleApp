/**
 * core library used for scheduling
 */
'use strict';

// load the modules
const debug = require('debug')('schedule:algorithm')

/**
 * Schedule an Activity to the actors
 *
 * @actor - the actor to schedule to
 * @action - the action to schedule
 * @time - the scheduling target time. The latest end for JIT or the earliest start for ASAP.
 * @mode - either 'JIT' or 'ASAP'
 **/
function schedule(activity, actors, time, mode) {

  debug('Schedule activity \'%s\'.', activity.name);

  if (activity.start || activity.end){
    debug('WARN: Activity \'%s\' is already scheduled.', activity.name);
    return;
  }

  let children = (mode==='JIT') ? activity.children : Array.from(activity.children).reverse();

  // iterate the child elements
  children.forEach((item, index) => {

    if (item.type === 'Activity') {

      schedule(item, actors, time, mode);
      activity.update(item); // track start and end on activity

    } else if (item.type === 'Action') {

      debug('Schedule action \'%s\'.', item.name);

      // iterate actor options until we find one that fits
      const actorName = item.actorOptions[0];
      const actor = actors.get(actorName);

      actor.schedule(actor, item, time, mode);
      actor.charge(actor, item); // charge the action changes to the actor states
      activity.update(item); // track start and end on activity
      item.actorChosen = actorName; // register the actor to the action

    } else {
      debug('ERROR: Unknown type \'%s\'of activity child element!', activity.type);
    }

    // adjust the time for adjacent calls
    if (mode === 'JIT')
      time = (activity.ordering === 'Series') ? item.start : item.end;
    else if (mode === 'ASAP')
      time = (activity.ordering === 'Series') ? item.end : item.start;
    else
      debug('ERROR: unknown mode \'%s\' schedule algorithm!', mode);

  });
};

/**
 * Release an activity by undo all changes made during scheduling trials
 *
 * @activity - the activity to schedule
 * @actors - a map of actors to schedule to
 **/
function release(activity, actors) {

  debug('Release activity \'%s\'.', activity.name);

  if (!activity.start || !activity.end){
    debug('WARN: Activity \'%s\' is already released.', activity.name);
    return;
  }

  // iterate the child elements
  activity.children.forEach((item, index) => {

    activity.end = undefined;
    activity.start = undefined;

    if (item.type === 'Activity') {

      release(item, actors);
      item.end = undefined;
      item.start = undefined;

    } else if (item.type === 'Action') {

      // undo changes on actor states
      const actorName = item.actorChosen;
      const actor = actors.get(actorName);
      actor.release(actor, item);

      // remove the changes build during scheduling
      item.changes = [];
      item.end = undefined;
      item.start = undefined;
      item.actorChosen = undefined;

      debug('Released action \'%s\' from actor \'%s\'', item.name, actor.name);

    } else {
      debug('ERROR: Unknown type \'%s\'of activity child element!', activity.type);
    }

  });
};

// the module definition
module.exports = {

  schedule: function(activity, actors, time, mode) {
    return schedule(activity, actors, time, mode);
  },
  release: function(activity, actors, time, mode) {
    return release(activity, actors);
  }

};
