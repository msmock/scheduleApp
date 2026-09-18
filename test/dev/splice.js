const _model = require('../../lib/model');
var assert = require('assert');

let state = _model.createState('capacity');
state.setValue(0, 0);
state.setValue(100, 1);
state.setValue(200, 0);
state.setValue(400, 2);
state.setValue(600, 0);

console.log('\nInitial state is %s', JSON.stringify(state));

let testTime = 150;
const testValue = 3;

const item = _model.createValue(testTime, testValue);

// insert or set
const match = state.timeline.find(item => (item.time >= testTime));
if (!match)
  state.timeline.push(item);
else if (match.time === item.time)
  match.value = item.value;
else
  state.timeline.splice(state.timeline.indexOf(match), 0, item);

console.log('\nState after insert is %s', JSON.stringify(state));
