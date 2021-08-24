'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExtraOwners = sequelize.define('ExtraOwners', {
    extraOwnerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    listId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'Lists',
            key: 'id'
        }
    }
  }, {});
  ExtraOwners.associate = function(models) {
    ExtraOwners.belongsTo(models.User, {
        as: 'extraOwner',
        foreignKey: 'extraOwnerId'
    }),
    ExtraOwners.belongsTo(models.List, {
        as: 'list',
        foreignKey: 'listId'
    })
  };
  return ExtraOwners;
};
