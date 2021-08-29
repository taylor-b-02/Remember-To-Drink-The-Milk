var express = require('express');
var router = express.Router();
const { csrfProtection } = require("../utils");

/* GET home page. */
router.get('/', csrfProtection, function(req, res, next) {
    if(req.session.auth) {
        const { userId } = req.session.auth
        res.redirect(`/users/${userId}`);
    }
  res.render('index', { title: 'Remember to Drink the Milk', csrfToken: req.csrfToken() });
});

module.exports = router;
