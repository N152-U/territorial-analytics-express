'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     * https://github.com/sequelize/sequelize/issues/3210
     * https://sequelize.org/master/manual/migrations.html
    */
    return queryInterface.bulkInsert('roles', [{
      id: 1,
      role: 'ADMIN',
      hash: uuidv4(),
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('roles', null, {});
  }
};
