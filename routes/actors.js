const express = require('express');
const model = require('../lib/model');

const router = express.Router();


router.get('/', function(req, res, next) {

  const container = model.getContainer();

  res.render('actors', {
    title: 'Actors',
    actors: Array.from(container.actors.values())
  });

});

module.exports = router;
