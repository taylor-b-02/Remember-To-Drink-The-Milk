'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isComplete: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: false,
        references: { model: 'Users' },
        type: Sequelize.INTEGER
      },
      listId: {
        allowNull: false,
        references: { model: 'Lists' },
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};
