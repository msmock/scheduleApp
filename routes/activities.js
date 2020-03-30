const express = require('express');
const model = require('../lib/model');

const url = require('url');
const querystring = require('querystring');

const router = express.Router();


router.get('/', function(req, res, next) {

  const container = model.getContainer();

    res.render('activities', {
      title: 'Activities',
      activities: Array.from(container.activities.values())
    });
});

module.exports = router;
