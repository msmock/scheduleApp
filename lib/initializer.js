/**
 * Initialize the world model for the application
 */
const model = require('../lib/model');
const toolbox = require('../lib/capacityPlanning');

// ----- time constants (ms) -----
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;
const WEEKS = 7 * DAYS;
const MONTHS = 30 * DAYS;
const YEARS = 365 * DAYS;

/**
 * 
 * sort of template to create an activity
 *
 * @param name
 * @returns {Activity}
 */
function buildActivity(name){

  const activity = model.createActivity(name, 'Series');

  // first child activity
  const child_1 = activity.buildActivity('Child 1', 'Series');

  child_1.buildAction('Produce Product 1', ['Product 1'], {
    quantity: 5,
    duration: 0
  });

  child_1.buildAction('Use Facility 1', ['Facility 1'], {
    quantity: 1,
    duration: 2*HOURS
  });

  child_1.buildAction('Use Facility 2', ['Facility 2'], {
    quantity: 1,
    duration: 2*HOURS // 2 hours
  });

  // next child activity
  const child_2 = activity.buildActivity('Child 2', 'Series');

  child_2.buildAction('Use Facility 3', ['Facility 3'], {
    quantity: 1,
    duration: 2*HOURS// 2 hours
  });

  child_2.buildAction('Consume Ingredient 1', ['Ingredient 1'], {
    quantity: -5,
    duration: 0
  });

  child_2.buildAction('Consume Ingredient 2', ['Ingredient 2'], {
    quantity: -10,
    duration: 0
  });

  // next child activity
  const child_3 = activity.buildActivity('Child 3', 'Series');

  child_3.buildAction('Use Facility 4', ['Facility 4'], {
    quantity: 1,
    duration: 4*HOURS
  });

  child_3.buildAction('Consume Ingredient 3', ['Ingredient 3'], {
    quantity: -5,
    duration: 0
  });

  child_3.buildAction('Consume Ingredient 4', ['Ingredient 4'], {
    quantity: -10,
    duration: 0
  });

  // next child activity
  const child_4 = activity.buildActivity('Child 4', 'Series');

  child_4.buildAction('Use Facility 4', ['Facility 5'], {
    quantity: 1,
    duration: 4*HOURS // 8 hours
  });

  child_4.buildAction('Consume Ingredient 3', ['Ingredient 5'], {
    quantity: -5,
    duration: 0
  });

  child_4.buildAction('Consume Ingredient 4', ['Ingredient 6'], {
    quantity: -10,
    duration: 0
  });

  return activity;
}


function init() {

  /**
   * activities
   */
  let activity = buildActivity('Act 1');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 2');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 3');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 4');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 5');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 6');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 7');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 8');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 9');
  model.getContainer().activities.set(activity.name, activity);

  activity = buildActivity('Act 10');
  model.getContainer().activities.set(activity.name, activity);

  /**
   * actors
   */
  const actors = model.getContainer().actors;

  let actor, state;

  actor = model.createActor('Ingredient 1');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 2');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  actor = model.createActor('Ingredient 3');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 4');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // set actor's policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 5');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // set actor's policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 6');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;
  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 1');
  state = actor.buildState('capacity');
  state.bound = 1;
  state.setValue(0, 0);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 2');
  state = actor.buildState('capacity');
  state.bound = 2;
  state.setValue(0, 0);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 3');
  state = actor.buildState('capacity');
  state.bound = 2;
  state.setValue(0, 0);

  // set actor's policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 4');
  state = actor.buildState('capacity');
  state.bound = 1; // only 1
  state.setValue(0, 0);

  // set actor's policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 5');
  state = actor.buildState('capacity');
  state.bound = 2;
  state.setValue(0, 0);

  // set actor's policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Product 1');
  state = actor.buildState('capacity');
  state.bound = 200;
  state.setValue(0, 0);

 // set actor's policies 
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

}

// the module definition
module.exports = {
  init: function() {
    return init();
  }
};
