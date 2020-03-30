const express = require('express');
const model = require('../lib/model');
const algorithm = require('../lib/algorithm');

const url = require('url');
const querystring = require('querystring');

const router = express.Router();


router.get('/', function(req, res, next) {

  const container = model.getContainer();

  if (req.query.name && req.query.action === 'scheduleDialog') {

    res.render('scheduleForm', {
      title: 'Activity: ' + req.query.name,
      activity: container.activities.get(req.query.name)
    });

  } else if (req.query.name && req.query.action === 'schedule') {

    const activity = container.activities.get(req.query.name);
    const actors = container.actors;
    const date = new Date(req.query.date+'T'+req.query.time);

    algorithm.schedule(activity, actors, date.getTime(), req.query.mode);

    res.render('activities', {
      title: 'Activities: ',
      activities: Array.from(container.activities.values())
    });

  } else if (req.query.name && req.query.action === 'release') {

    const activity = container.activities.get(req.query.name);
    const actors = container.actors;

    algorithm.release(activity, actors);

    res.render('activities', {
      title: 'Activities: ',
      activities: Array.from(container.activities.values())
    });

  } else if (req.query.name) {

    res.render('activity', {
      title: 'Activity: ' + req.query.name,
      activity: container.activities.get(req.query.name)
    });

  } else {

    res.render('index', {
      title: 'Schedule App'
    });
  }

});


module.exports = router;
