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
      references:{model: "Users"}
    } 
  }, {});
  Lists.associate = function(models) {
    // associations can be defined here
    Lists.belongsTo(models.User, {foreignKey:'ownerId'})
    Lists.hasMany(models.Task, {foreignKey:'listId'})
    Lists.hasMany(models.ExtraOwner, {foreignKey:'listId'})
  };
  return Lists;
};