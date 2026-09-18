// load the modules
const _model = require('../../lib/model');
const _algorithm = require('../../lib/algorithm');
const _toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

// OK , here we go. Define the activity to be scheduled.
const activity = _model.createActivity('Test Activity', 'Series');

activity.buildAction('Produce Product 1', ['Product 1'], {
  quantity: 5,
  duration: 0
});

activity.buildAction('Use Facility 1', ['Facility 1'], {
  quantity: 1,
  duration: 3000
});

activity.buildAction('Consume Ingredient 2', ['Ingredient 2'], {
  quantity: -10,
  duration: 0
});

activity.buildAction('Consume Ingredient 1', ['Ingredient 1'], {
  quantity: -5,
  duration: 0
});



// define map of actors
const map = new Map();

// new actor
let actor = _model.createActor('Ingredient 1');
let state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);
state.setValue(2000, 10);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// new actor
actor = _model.createActor('Ingredient 2');
state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);
state.setValue(3000, 15);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// new actor
actor = _model.createActor('Facility 1');
state = actor.buildState('capacity');
state.bound = 1;
state.setValue(0, 0);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// new actor
actor = _model.createActor('Product 1');
state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 15);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// Now go with schedule test

_algorithm.schedule(activity, map, 1000, 'ASAP');

activity.children.forEach((action, index) => {

  switch (action.name) {
    case 'Consume Ingredient 1':
      assert.equal(action.start, 2000);
      break;
    case 'Consume Ingredient 2':
      assert.equal(action.start, 3000);
      break;
    case 'Use Facility 1':
      assert.equal(action.start, 3000);
      assert.equal(action.end, 6000);
      break;
    case 'Produce Product 1':
      assert.equal(action.start, 6000);
      break;
  }
});
