// load the modules
const model = require('../../lib/model');
const algorithm = require('../../lib/algorithm');
const toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

/** OK , here we go. Define the activity to be scheduled. **/

const activity = model.createActivity('Act 1', 'Series');

// first child activity
const child_1 = activity.buildActivity('Child 1', 'Series');

child_1.buildAction('Produce Product 1', ['Product 1'], {
  quantity: 5,
  duration: 0
});

child_1.buildAction('Use Facility 1', ['Facility 1'], {
  quantity: 1,
  duration: 3000
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

// define map of actors
const actors = new Map();

let actor = model.createActor('Ingredient 1');
let state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);
state.setValue(2000, 20);

// add the policies
actor.schedule = toolbox.schedule;
actor.charge = toolbox.charge;
actor.release = toolbox.release;

actors.set(actor.name, actor);

// new actor
actor = model.createActor('Ingredient 2');
state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);
state.setValue(3000, 20);

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
actor = model.createActor('Product 1');
state = actor.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);

// add the policies
actor.schedule = toolbox.schedule;
actor.charge = toolbox.charge;
actor.release = toolbox.release;

actors.set(actor.name, actor);

algorithm.schedule(activity, actors, 20000, 'JIT');

let facility = actors.get('Facility 1');

// now verify

let value = facility.states[0].getAt(1);
assert.equal(value.time, 0);
assert.equal(value.value, 0);

value = facility.states[0].getAt(17000);
assert.equal(value.time, 17000);
assert.equal(value.value, 1);

value = facility.states[0].getAt(20000);
assert.equal(value.time, 20000);
assert.equal(value.value, 0);

value = facility.states[0].getAt(20001);
assert.equal(value.time, 20000);
assert.equal(value.value, 0);
