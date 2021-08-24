var express = require('express');
const { INTEGER } = require('sequelize/types');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'a/A Express Skeleton Home' });
});

module.exports = router;

