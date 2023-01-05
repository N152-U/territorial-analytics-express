'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles_has_permissions', {
      roleId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'role_id'
      },
      permissionId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'permission_id'
      },
      createdAt:
      {
        type: Sequelize.DATE,
        field: 'created_at'
      }
    }, {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles_has_permissions');
  }
};