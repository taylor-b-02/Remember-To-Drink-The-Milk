const express = require("express");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;

const router = express.Router();

// Create a task
router.post(
	"/tasks",
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
	"/tasks/:id",
	asyncHandler(async (req, res, next) => {
		const taskId = req.params.id;
		const task = await Task.findByPk(taskId);
		task.destroy();
		res.send(200);
	})
);

// Edit a task
router.patch(
	"/tasks/:id",
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

// Is Complete toggle route
router.patch(
	"/tasks/:id",
	asyncHandler(async (req, res, next) => {
		const taskId = req.params.id;
		const task = await Task.findByPk(taskId);
		if (task.isComplete) {
			task.isComplete = false;
		} else {
			task.isComplete = true;
		}
		await task.save();
		res.send(200);
	})
);

module.exports = router;
