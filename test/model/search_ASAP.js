// load the module
const _model = require('../../lib/model');
var assert = require('assert');

// get a new actor to perform some tests
const actor = _model.createActor('res_1');

// a simple actor state using a number to manage capacity of the actor
const state = actor.buildState('capacity');
state.setValue(0, 0);
state.setValue(100, 5);
state.setValue(200, 15);
state.setValue(300, 0);

/**
 * The condition used when searching the values to decide whether we can place
 * a change. In this example we use a simple condition and just check the sum of
 * the value and the change is greater zero (lower bound) and less or equal to the
 * upper bound.
 **/
const condition = (changeValue, bound) => {
  // the conditon function
  return (item, index, timeline) => ((item.value + changeValue >= 0) && (item.value + changeValue <= bound));
}

// now run the tests
let playTime = state.searchASAP(50, condition(-5, 20));
assert.equal(100, playTime);

playTime = state.searchASAP(50, condition(-15, 20));
assert.equal(200, playTime);

playTime = state.searchASAP(50, condition(-20, 20));
assert.equal(undefined, playTime);

playTime = state.searchASAP(50, condition(20, 20));
assert.equal(50, playTime);

playTime = state.searchASAP(150, condition(20, 20));
assert.equal(300, playTime);

playTime = state.searchASAP(150, condition(5, 20));
assert.equal(150, playTime);

playTime = state.searchASAP(150, condition(21, 20));
assert.equal(undefined, playTime);
