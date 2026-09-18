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


// jamASAP(time, condition, duration)
let playTime;

playTime = state.jamASAP(100, condition(1, 1), 500);
assert.equal(100, playTime);

playTime = state.jamASAP(500, condition(1, 1), 500);
assert.equal(500, playTime);

playTime = state.jamASAP(501, condition(1, 1), 500);
assert.equal(2000, playTime);

playTime = state.jamASAP(501, condition(1, 1), 1000);
assert.equal(3000, playTime);

playTime = state.jamASAP(3000, condition(1, 1), 2000);
assert.equal(3000, playTime);

playTime = state.jamASAP(3001, condition(1, 1), 2000);
assert.equal(undefined, playTime);

playTime = state.jamASAP(4500, condition(1, 1), 1000);
assert.equal(undefined, playTime);
