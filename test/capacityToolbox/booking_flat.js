// load the modules
const _model = require('../../lib/model');
const _algorithm = require('../../lib/algorithm');
const _toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

/** OK , here we go. Define the activity to be scheduled. **/
const activity = _model.createActivity('Test Activity', 'Series');

activity.buildAction('Produce Product 1', ['Product 1'], {
  quantity: 5,
  duration: 0
});

activity.buildAction('Use Facility 1', ['Facility 1'], {
  quantity: 1,
  duration: 3000
});

// define map of actors
const actors = new Map();

// new actor
const facility = _model.createActor('Facility 1');
let state = facility.buildState('capacity');
state.bound = 1;
state.setValue(0, 0);

// add the policies
facility.schedule = _toolbox.schedule;
facility.charge = _toolbox.charge;
facility.release = _toolbox.release;

actors.set(facility.name, facility);

// new actor
const product = _model.createActor('Product 1');
state = product.buildState('capacity');
state.bound = 20;
state.setValue(0, 0);

// add the policies
product.schedule = _toolbox.schedule;
product.charge = _toolbox.charge;
product.release = _toolbox.release;

actors.set(product.name, product);

_algorithm.schedule(activity, actors, 20000, 'ASAP');

// Now go with schedule test
value = facility.states[0].getAt(20000);
assert.equal(value.time, 20000);
assert.equal(value.value, 1);

value = facility.states[0].getAt(23000);
assert.equal(value.time, 23000);
assert.equal(value.value, 0);

value = facility.states[0].getAt(25000);
assert.equal(value.time, 23000);
assert.equal(value.value, 0);


// product
value = product.states[0].getAt(20000);
assert.equal(value.time, 0);
assert.equal(value.value, 0);

value = product.states[0].getAt(22999);
assert.equal(value.value, 0);
assert.equal(value.time, 0);

value = product.states[0].getAt(23000);
assert.equal(value.time, 23000);
assert.equal(value.value, 5);

value = product.states[0].getAt(25000);
assert.equal(value.time, 23000);
assert.equal(value.value, 5);
