'use strict';

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
    return queryInterface.bulkInsert('roles_has_permissions', [{
      role_id: 1,
      permission_id: 1,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 2,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 3,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 4,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 5,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 6,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 7,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 8,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 9,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 10,
      created_at: new Date(),
    },
    {
      role_id: 1,
      permission_id: 11,
      created_at: new Date(),
    },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('roles_has_permissions', null, {});
  }
};
