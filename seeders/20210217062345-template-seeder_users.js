'use strict';


const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
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
    */
    return queryInterface.bulkInsert('users', [{
      id:1,
      username: "admin",
      password: bcrypt.hashSync("admin", SALT_WORK_FACTOR),
      first_name: "ADMINISTRADOR",
      middle_name: "",
      last_name: "",
      status: true,
      hash: uuidv4(),
      created_at: new Date(),
      updated_at: new Date(),
      role_id: 1
    }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users', null, {});
  }
};
