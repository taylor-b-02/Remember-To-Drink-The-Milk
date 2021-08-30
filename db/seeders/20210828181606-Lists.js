"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
		return queryInterface.bulkInsert(
			"Lists",
			[
				{
					id: 99,
					name: "Today",
					ownerId: 99999,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 100,
					name: "Tomorrow",
					ownerId: 99999,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 101,
					name: "Next Week",
					ownerId: 99999,
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
		return queryInterface.bulkDelete("Lists", null, {
			truncate: true,
			cascade: true,
			restartIdentity: true,
		});
	},
};
