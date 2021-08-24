'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ExtraOwners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      extraOwnerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'Users'
        }
      },
      listId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'Lists'
        }
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
    return queryInterface.dropTable('ExtraOwners');
  }
};
