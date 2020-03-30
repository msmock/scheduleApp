const model = require('../lib/model');
const toolbox = require('../lib/capacityPlanning');
const algorithm = require('../lib/algorithm');

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
    duration: 60000*60*2 // 2 hours
  });

  // next child activity
  const child_2 = activity.buildActivity('Child 2', 'Series');

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

  child_1.buildAction('Use Facility 2', ['Facility 2'], {
    quantity: 1,
    duration: 60000*60*8 // 8 hours
  });

  child_3.buildAction('Consume Ingredient 3', ['Ingredient 3'], {
    quantity: -5,
    duration: 0
  });

  child_3.buildAction('Consume Ingredient 4', ['Ingredient 4'], {
    quantity: -10,
    duration: 0
  });

  return activity;
}


function init() {

  // activities
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

  // actors
  const actors = model.getContainer().actors;

  let actor, state;

  actor = model.createActor('Ingredient 1');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 2');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  actor = model.createActor('Ingredient 3');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Ingredient 4');
  state = actor.buildState('capacity');
  state.bound = 100;
  state.setValue(0, 100);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 1');
  state = actor.buildState('capacity');
  state.bound = 1;
  state.setValue(0, 0);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Facility 2');
  state = actor.buildState('capacity');
  state.bound = 2;
  state.setValue(0, 0);

  // add the policies
  actor.schedule = toolbox.schedule;
  actor.charge = toolbox.charge;
  actor.release = toolbox.release;

  actors.set(actor.name, actor);

  // new actor
  actor = model.createActor('Product 1');
  state = actor.buildState('capacity');
  state.bound = 200;
  state.setValue(0, 0);

  // add the policies
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
