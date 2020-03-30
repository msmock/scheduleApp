const express = require('express');
const model = require('../lib/model');

const url = require('url');
const querystring = require('querystring');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to the schedule App api!'
  });
});

router.get('/activities', function(req, res, next) {
  const container = model.getContainer();
  res.json(Array.from(container.activities.values()));
});

router.get('/actors', function(req, res, next) {
  const container = model.getContainer();
  res.json(Array.from(container.actors.values()));
});

router.get('/actions', function(req, res, next) {

  const container = model.getContainer();
  const activities = Array.from(container.activities.values()).filter(
      activity => activity.start && activity.end);

  const actions = [];
  for (let activity of activities){
    const childs = activity.actions();
    for (let child of childs)
      actions.push(child);
  }

  res.json(actions);
});


module.exports = router;
