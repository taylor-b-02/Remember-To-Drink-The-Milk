const express = require("express");
const { asyncHandler } = require("../utils");
const db = require("../db/models");
const { Lists, Task } = db;

const router = express.Router();

router.get("/all", (req, res) => {});

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

router.get(
	"/:id/tasks",
	asyncHandler(async (req, res) => {
		const id = parseInt(req.params.id, 10);
		const tasks = Task.findAll({
			where: {
				listId: {
					[Op.eq]: id,
				},
			},
		});
	})
);

module.exports = router;
