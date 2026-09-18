// load the module
const _model = require('../../lib/model');
var assert = require('assert');

/**
 * The condition used when searching the values to decide whether we can place
 * a change. In this example we use a simple condition and just check the sum of
 * the value and the change is greater zero (lower bound) and less or equal to the
 * upper bound.
 **/
const condition = (changeValue, bound) => {
  return (item, index, timeline) => ((item.value + changeValue >= 0) && (item.value + changeValue <= bound));
}

// now run the tests

// a simple actor state using a number to control the capacity
let state = _model.createState('capacity');
state.setValue(0, 20);
state.setValue(100, 15);
state.setValue(200, 5);
state.setValue(300, 0);

let playTime = state.searchJIT(500, condition(5, 20));
assert.equal(500, playTime);

playTime = state.searchJIT(250, condition(15, 20));
assert.equal(250, playTime);

playTime = state.searchJIT(350, condition(16, 20));
assert.equal(350, playTime);


// a simple actor state using a number to control the capacity
state = _model.createState('capacity');
state.setValue(0, 0);
state.setValue(100, 20);
state.setValue(200, 15);
state.setValue(300, 5);

playTime = state.searchJIT(500, condition(-5, 20));
assert.equal(500, playTime);

playTime = state.searchJIT(500, condition(-15, 20));
assert.equal(300, playTime);

playTime = state.searchJIT(500, condition(-20, 20));
assert.equal(200, playTime);

playTime = state.searchJIT(500, condition(-22, 20));
assert.equal(undefined, playTime);
