'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lists = sequelize.define('Lists', {
    name: {
      allowNull: false,
      type:DataTypes.STRING,
    },
    ownerId: {
      allowNull: false,
      type:DataTypes.INTEGER,
      references:{model: "ExtraOwners"}
    }
  }, {});
  Lists.associate = function(models) {
    // associations can be defined here
    Lists.hasMany(models.Task, {foreignKey:'listId'})
    Lists.hasMany(models.ExtraOwners, {foreignKey:'listId'})
  };
  return Lists;
};
