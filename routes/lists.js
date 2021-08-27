const express = require("express");
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = express.Router();

router.get(
	"/",
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
	"/",
	asyncHandler(async (req, res) => {
		const { name } = req.body;
		const { userId } = req.session.auth;
		const newList = await Lists.create({ name: name, ownerId: userId });
		res.json(newList.id);
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
router.post(
	"/:id/",
	asyncHandler(async (req, res) => {
		const listId = parseInt(req.params.id, 10);
		const { description } = req.body;
		const { userId } = req.session.auth;

		console.log("Description:", description, "ListId:", listId);
		const newTask = await Task.create({
			isComplete: false,
			description: description,
			userId: userId,
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

// Delete a list
router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const listId = req.params.id;
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
	"/:id",
	asyncHandler(async (req, res) => {
		const listId = req.params.id;
		const { name } = req.body;
		const list = await Lists.findByPk(listId);
		await list.update({
			name: name,
		});
		res.send(200);
	})
);

module.exports = router;
