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

state.setValue(5000, 1);

// jamJIT(time, condition, duration)
let playTime;

playTime = state.jamASAP(4500, condition(1, 1), 1000);
assert.equal(undefined, playTime);
