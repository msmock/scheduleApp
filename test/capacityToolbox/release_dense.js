// load the modules
const model = require('../../lib/model');
const algorithm = require('../../lib/algorithm');
const toolbox = require('../../lib/capacityPlanning');
const assert = require('assert');

// define map of actors
const actors = new Map();

// new actor
const facility = model.createActor('Facility 1');
let state = facility.buildState('capacity');
state.bound = 1;
state.setValue(0, 0);

// add the policies
facility.schedule = toolbox.schedule;
facility.charge = toolbox.charge;
facility.release = toolbox.release;

actors.set(facility.name, facility);

// new actor
const product = model.createActor('Product 1');
state = product.buildState('capacity');
state.bound = 200;
state.setValue(0, 0);

// add the policies
product.schedule = toolbox.schedule;
product.charge = toolbox.charge;
product.release = toolbox.release;

actors.set(product.name, product);

/** the activities **/
function activity(name) {

  const activity = model.createActivity(name, 'Series');

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
algorithm.schedule(act_1, actors, 10000, 'ASAP');
algorithm.schedule(act_2, actors, 10000, 'ASAP');
algorithm.schedule(act_3, actors, 10000, 'ASAP');

/** now release **/
algorithm.release(act_1, actors);
algorithm.release(act_2, actors);
algorithm.release(act_3, actors);

assert.equal(product.states[0].timeline.length, 1);
assert.equal(facility.states[0].timeline.length, 1);
