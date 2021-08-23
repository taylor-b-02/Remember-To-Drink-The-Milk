'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email:{
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    } ,
    userName: {
      allowNull: false,
      type: Sequelize.STRING(50),
      unique: true
    },
    dateOfBirth: {
      allowNull: false,
      type: Sequelize.DATE
    },
    hashedPassword: {
      allowNull: false,
      type: Sequelize.STRING.BINARY
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};