const express = require("express");
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { requireAuth } = require("../auth");
const router = express.Router();
const app = express();

app.set('view engine', 'pug');

router.get(
	"/", requireAuth,
	asyncHandler(async (req, res) => {
		const { userId } = req.session.auth;
		const lists = await Lists.findAll({
			where: {
				ownerId: userId,
			},
		});
		res.json(lists);
	})
);



// Create a list
router.post(
	"/", requireAuth,
	asyncHandler(async (req, res) => {
		const { name } = req.body;
		const { userId } = req.session.auth;
		const newList = await Lists.create({ name: name, ownerId: userId });
		res.json(newList.id);
	})
);

// Get a list
router.get(
	"/:id(\\d+)/", requireAuth,
	asyncHandler(async (req, res) => {
		const id = parseInt(req.params.id, 10);
		const list = await Lists.findByPk(id);
		res.json(list);
	})
);

// Create a new task and at it to the current list
router.post(
	"/:id(\\d+)/", requireAuth,
	asyncHandler(async (req, res, next) => {
		const listId = parseInt(req.params.id, 10);
		const { description } = req.body;
		const { userId } = req.session.auth;

		console.log("Description:", description, "ListId:", listId);
		const newTask = await Task.create({
			isComplete: false,
			description: description,
			ownerId: userId,
			listId: listId,
		});
		res.json(newTask);
	})
);

// Get all the tasks from a list
router.get(
	"/:id(\\d+)/tasks", requireAuth,
	asyncHandler(async (req, res) => {
		const id = parseInt(req.params.id, 10);
		const tasks = await Task.findAll({
			where: {
				listId: {
					[Op.eq]: id,
				},
			},
		});
		res.json(tasks);
	})
);

// Delete a list
router.delete(
	"/:id(\\d+)", requireAuth,
	asyncHandler(async (req, res) => {
		const listId = parseInt(req.params.id, 10);
		await Task.destroy({
			where: {
				listId: listId,
			},
		});
		const list = await List.findByPk(listId);
		list.destroy();
		res.send(200);
	})
);

// Edit a list (name)
router.patch(
	"/:id(\\d+)", requireAuth,
	asyncHandler(async (req, res) => {
		const listId = parseInt(req.params.id, 10);
		const { name } = req.body;
		const list = await Lists.findByPk(listId);
		await list.update({
			name: name,
		});
		res.send(200);
	})
);

//new SEARCH
router.get('/searchResults/:searchInput', requireAuth, asyncHandler(async(req, res, next) => {
    const { userId } = req.session.auth;
    const searchInput  = req.params.searchInput;


    const tasks = await Task.findAll({
        where: {
            userId: userId,
        }
    });

    const searchTasks = tasks.filter(function(el) {
        if(el.description.includes(searchInput)) {
            return el;
        }
    });

    const readSearchTasks = searchTasks.map(function (task) {
        const list = Lists.findByPk(task.listId)
        let readTask = {
            type: 'tasks',
            id: task.id,
            name: task.description,
        }
        return readTask;
    });

    const lists = await Lists.findAll({
        where: {
            ownerId: userId,
        }
    });
    const searchLists = lists.filter(function(el) {
        if(el.name.includes(searchInput)) {
            return el;
        }
    });

    const readSearchLists = searchLists.map(function (list) {
        readList = {
            type: 'lists',
            id: list.id,
            name: list.name
        }
        return readList;
    });

    const result = [...readSearchTasks, ...readSearchLists];
    console.log(result);

    res.render('search-results', {title: 'Search', searchInput, result, userId} );

}));

// router.get('/searchResults', requireAuth, asyncHandler(async(req, res) => {
//     res.render('search-results')

// }))

module.exports = router;
