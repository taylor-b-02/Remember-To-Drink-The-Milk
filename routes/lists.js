const express = require("express");
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { requireAuth } = require("../auth");
const router = express.Router();

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

//SEARCH
// router.get(
// 	"/search", requireAuth,
// 	asyncHandler(async (req, res) => {
// 		const { userId } = req.session.auth;
// 		const tasks = await db.Task.findAll({
//             where: {
//                 userId: userId,
//             },
//         });
//         const lists = await db.List.findAll({
//             where: {
//                 ownerId: userId,
//             },
//         });
//         const ultimate = [...tasks, ...lists]
//         const result = ultimate.filter(function(el) {
//             if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
//                 return el;
//             }
//         });
//         if(!result) {
//             res.json(`Nothing found`);
//         }else{
//             res.json(result);
//         }
// 	})
// );

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
	"/:id/", requireAuth,
	asyncHandler(async (req, res) => {
		const id = parseInt(req.params.id, 10);
		const list = await Lists.findOne({
			where: {
                id: id,
            }
		});
		res.json(list);
	})
);

// Create a new task and at it to the current list
router.post(
	"/:id/", requireAuth,
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
	"/:id/tasks", requireAuth,
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
	"/:id", requireAuth,
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
	"/:id", requireAuth,
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
    const result = allListsTasks.filter(function(el) {
        if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
            return el;
        }
    });
    res.render('search-results', {title: 'Search', inputValue, result} )

}))

module.exports = router;
