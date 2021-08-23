const express = require('express');
const router = express.Router();
const db = require('../db/models');
const bcrypt = require('bcryptjs');
const { csrfProtection, asyncHandler, handleValidationErrors } = require('../utils');

const { check } = require('express-validator');

const { User } = db;


/* GET users listing. */
//GET user profile
router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const user = await db.User.findByPk(userId);
    res.render('user-profile', { title: 'User', user });

}));

//GET registration page with form
router.get('/register', csrfProtection, asyncHandler(async(req, res) => {
    res.render('user-register', { title: 'Register' })
}));

//GET login page with form
router.get('/login', csrfProtection, asyncHandler(async(req, res) => {
    res.render('user-login', {
        title: "Login",
        csrfToken: req.csrfToken()
    })
}));

//POST to login page (log in) NEEDS user/password validator
router.post('/login', csrfProtection, handleValidationErrors, asyncHandler(async(req, res) => {

}))

//GET login page with form
router.get('/logout', csrfProtection, asyncHandler(async(req, res) => {

}));

//POST new users (register) NEEDS form validation
router.post('/', csrfProtection, handleValidationErrors, asyncHandler(async(req, res) => {

}))



module.exports = router;
