const router = require("./routes/lists");
const { asyncHandler } = require("./utils");
const db = require("../db/models");
const { List, Task } = db;
const { requireAuth } = require("../auth");

router.get('/searchResults', requireAuth, asyncHandler(async(req, res, next) => {
    const { userId } = req.session.auth;
    const inputValue = document.getElementById('nav-search-input').value;
    const tasks = Task.findAll({
        where: {
            userId: userId,
        }
    });
    const lists = List.findAll({
        where: {
            ownerId: userId,
        }
    });

    const allListsTasks = [...tasks, ...lists];
    console.log(allListsTasks);
    const result = ultimate.filter(function(el) {
        if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
            return el;
        }
    });
    res.render('search-results', {title: 'Search', inputValue, result} )

}))
