const express = require('express');
const model = require('../lib/model');

const router = express.Router();


router.get('/', function(req, res, next) {

  const container = model.getContainer();

  if (req.query.name && req.query.state) {

    res.render('state', {
      title: 'State: ' + req.query.name + '/' + req.query.state,
      state: container.actors.get(req.query.name).state(req.query.state)
    });

  } else if (req.query.name) {

    res.render('actor', {
      title: 'Actor: ' + req.query.name,
      actor: container.actors.get(req.query.name)
    });

  }

});

module.exports = router;
