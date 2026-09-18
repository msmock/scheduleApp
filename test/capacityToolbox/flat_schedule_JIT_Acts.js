// load the modules
const _model = require('../../lib/model');
const _algorithm = require('../../lib/algorithm');
const _toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

// OK , here we go. Define the activity to be scheduled.
const activity_1 = _model.createActivity('Test Activity 1', 'Series');

activity_1.buildAction('Use Facility 1', ['Facility 1'], {
  quantity: 1,
  duration: 100
});

activity_1.buildAction('Use Facility 2', ['Facility 2'], {
  quantity: 1,
  duration: 200
});

activity_1.buildAction('Use Facility 3', ['Facility 3'], {
  quantity: 1,
  duration: 100
});

const activity_2 = _model.createActivity('Test Activity 2', 'Series');

activity_2.buildAction('Use Facility 1', ['Facility 1'], {
  quantity: 1,
  duration: 100
});

activity_2.buildAction('Use Facility 2', ['Facility 2'], {
  quantity: 1,
  duration: 200
});

activity_2.buildAction('Use Facility 3', ['Facility 3'], {
  quantity: 1,
  duration: 100
});


/** the actor definitions **/
const map = new Map();

// new actor
let actor = _model.createActor('Facility 1');
let state = actor.buildState('capacity');
state.bound = 1;
state.setValue(0, 0);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// new actor
actor = _model.createActor('Facility 2');
state = actor.buildState('capacity');
state.bound = 2;
state.setValue(0, 0);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// new actor
actor = _model.createActor('Facility 3');
state = actor.buildState('capacity');
state.bound = 1;
state.setValue(0, 0);

// add the policies
actor.schedule = _toolbox.schedule;
actor.charge = _toolbox.charge;
actor.release = _toolbox.release;

map.set(actor.name, actor);

// Now go with schedule test
_algorithm.schedule(activity_1, map, 1000, 'JIT');
_algorithm.schedule(activity_2, map, 1000, 'JIT');

activity_1.children.forEach((action, index) => {

  switch (action.name) {
    case 'Use Facility 1':
      assert.equal(action.end, 1000);
      assert.equal(action.start, 900);
      break;
    case 'Use Facility 2':
      assert.equal(action.end, 900);
      assert.equal(action.start, 700);
      break;
    case 'Use Facility 3':
      assert.equal(action.end, 700);
      assert.equal(action.start, 600);
      break;
  }
});

activity_2.children.forEach((action, index) => {

  switch (action.name) {
    case 'Use Facility 1':
      assert.equal(action.end, 900);
      assert.equal(action.start, 800);
      break;
    case 'Use Facility 2':
      assert.equal(action.end, 800);
      assert.equal(action.start, 600);
      break;
    case 'Use Facility 3':
      assert.equal(action.end, 700);
      assert.equal(action.start, 600);
      break;
  }
});
