var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Schedule App' });
});

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Schedule App' });
});

router.get('/gantt', function(req, res, next) {
  res.render('gantt', { title: 'Gantt Chart' });
});

module.exports = router;
