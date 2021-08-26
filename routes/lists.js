const express = require("express");
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

router.get(
	"/all",
	asyncHandler(async (req, res) => {})
);

// Create a list
/* TODO Figure out how to pull userId from the session information to use in list creation
   and task creation */
router.post(
	"/",
	asyncHandler(async (req, res) => {
		const { name } = req.body;
		const newList = await Lists.create({ name: name, ownerId: 2 });
	})
);

// Get a list
router.get(
	"/:id/",
	asyncHandler(async (req, res) => {
		const id = parseInt(req.params.id, 10);
		const list = await Lists.findOne({
			where: id,
		});
		res.json(list);
	})
);

// Create a new task and at it to the current list
//TODO Change out userId for a userId pulled from the session information
router.post(
	"/:id/",
	asyncHandler(async (req, res) => {
		const listId = parseInt(req.params.id, 10);
		const { description } = req.body;
		console.log("Description:", description, "ListId:", listId);
		const newTask = await Task.create({
			isComplete: false,
			description: description,
			userId: 2,
			listId: listId,
		});
		res.json(newTask);
	})
);

// Get all the tasks from a list
router.get(
	"/:id/tasks",
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

// Delete a task from a list (and the database as whole?)
router.delete(
	"/:listId/tasks/:taskId",
	asyncHandler(async (req, res) => {
		let { listId, taskId } = req.params;
		listId = parseInt(listId, 10);
		taskId = parseInt(taskId, 10);
		console.log("listId:", listId, "taskId:", taskId);
		res.end();
	})
);

module.exports = router;
