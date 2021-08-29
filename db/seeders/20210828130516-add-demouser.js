'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Users', [{
     id: 99999,
     email: 'email@email.com',
     userName: 'demoUser',
     dateOfBirth: new Date(),
     hashedPassword: '$2a$10$7A0LabzERFXangwMPU1yD.WCC9Ra.dD9dAPClJYaoqGc0AWXpjTgy',
     createdAt:  new Date(),
     updatedAt: new Date()
   }], {});

  },



  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Users', null, {});
  }
};
