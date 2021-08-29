const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;

const router = express.Router();

// Create a task
router.post(
	"/",
	asyncHandler(async (req, res, next) => {
		const { description, listId } = req.body;
		const { userId } = req.session.auth;
		const newTask = await Task.create({
			isComplete: false,
			description: description,
			userId: userId,
			listId: listId,
		});

		res.json(newTask);
	})
);

// Delete a task
router.delete(
	"/:id",
	asyncHandler(async (req, res, next) => {
		const taskId = req.params.id;
		const task = await Task.findByPk(taskId);
		task.destroy();
		res.send(200);
	})
);

// Edit a task
router.patch(
	"/:id",
	asyncHandler(async (req, res, next) => {
		const taskId = req.params.id;
		const { description } = req.body;
		const task = await Task.findByPk(taskId);
		await task.update({
			description: description,
		});
		res.json(task);
	})
);

router.patch(
	"/:id/toggleComplete",
	asyncHandler(async (req, res, next) => {
		const taskId = req.params.id;
		const { isComplete } = req.body;
		const task = await Task.findByPk(taskId);
		await task.update({
			isComplete: isComplete,
		});
		res.json(task);
	})
);

// Get all of a users tasks
router.get(
	"/",
	asyncHandler(async (req, res, next) => {
		const { userId } = req.session.auth;
		const tasks = await Task.findAll({
			where: {
				userId: userId,
			},
		});
		res.json(tasks);
	})
);
module.exports = router;
