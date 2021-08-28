var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.auth) {
        const { userId } = req.session.auth
        res.redirect(`/users/${userId}`);
    }
  res.render('index', { title: 'Remember to Drink the Milk' });
});

module.exports = router;
