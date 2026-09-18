// load the modules
const _model = require('../../lib/model');
const _algorithm = require('../../lib/algorithm');
const _toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

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
state.bound = 200;
state.setValue(0, 0);

// add the policies
product.schedule = _toolbox.schedule;
product.charge = _toolbox.charge;
product.release = _toolbox.release;

actors.set(product.name, product);

/** the activities **/
function activity(name) {

  const activity = _model.createActivity(name, 'Series');

  activity.buildAction('Produce Product 1', ['Product 1'], {
    quantity: 5,
    duration: 0
  });

  activity.buildAction('Use Facility 1', ['Facility 1'], {
    quantity: 1,
    duration: 1000
  });

  return activity;
}

const act_1 = activity('Act 1');
const act_2 = activity('Act 2');
const act_3 = activity('Act 3');

/** now schedule **/
_algorithm.schedule(act_1, actors, 20000, 'ASAP');
_algorithm.schedule(act_2, actors, 30000, 'ASAP');
_algorithm.schedule(act_3, actors, 40000, 'ASAP');

/** now release **/
_algorithm.release(act_1, actors);
_algorithm.release(act_2, actors);
_algorithm.release(act_3, actors);

assert.equal(product.states[0].timeline.length, 1);
assert.equal(facility.states[0].timeline.length, 1);

// TBD: verify that all start and end dates as well as the changes are removed
