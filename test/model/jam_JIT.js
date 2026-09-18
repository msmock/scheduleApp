// load the modules
const _model = require('../../lib/model');
var assert = require('assert');


const condition = (changeValue, bound) => {
  return (item, index, timeline) => ((item.value + changeValue >= 0) && (item.value + changeValue <= bound));
};

// a simple actor state using a number to control the capacity
let state = _model.createState('capacity');
state.setValue(0, 0);

// blocked from 1000 - 2000
state.setValue(1000, 1);
state.setValue(2000, 0);

// blocked from 2500 - 3000
state.setValue(2500, 1);
state.setValue(3000, 0);

// blocked after 5000
state.setValue(5000, 1);

// jamJIT(time, condition, duration)
let playTime = state.jamJIT(5500, condition(1, 1), 500);
assert.equal(5500, playTime);

playTime = state.jamJIT(4500, condition(1, 1), 500);
assert.equal(4500, playTime);

playTime = state.jamJIT(4500, condition(1, 1), 1000);
assert.equal(4500, playTime);

playTime = state.jamJIT(6000, condition(1, 1), 1000);
assert.equal(6000, playTime);

playTime = state.jamJIT(6000, condition(1, 1), 2000);
assert.equal(5000, playTime);

playTime = state.jamJIT(1500, condition(1, 1), 1000);
assert.equal(1000, playTime);

// bound > 1
playTime = state.jamJIT(3500, condition(1, 2), 1000);
assert.equal(3500, playTime);
