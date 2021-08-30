"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
		return queryInterface.bulkInsert(
			"Tasks",
			[
				{
					id: 999,
					isComplete: false,
					description: "Drink 3 glasses of water",
					userId: 99999,
					listId: 99,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 1000,
					isComplete: false,
					description: "Meditate before work",
					userId: 99999,
					listId: 99,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 1001,
					isComplete: false,
					description: "Go jogging",
					userId: 99999,
					listId: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 1002,
					isComplete: false,
					description: "Do grocery shopping",
					userId: 99999,
					listId: 100,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 1003,
					isComplete: false,
					description: "Go to therapy appointment",
					userId: 99999,
					listId: 101,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 1004,
					isComplete: false,
					description: "Eat 3 servings of vegetables",
					userId: 99999,
					listId: 101,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
		return queryInterface.bulkDelete("Tasks", null, {
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});
	},
};
