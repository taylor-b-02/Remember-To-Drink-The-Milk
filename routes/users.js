const express = require('express');
const router = express.Router();
const db = require('../db/models');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');

const { User } = db;


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
    res.render()
})

router.post('/', (req, res) => {

})

router

module.exports = router;
