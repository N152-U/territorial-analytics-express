'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'role_id'
      },
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
          try {
            const hash = bcrypt.hashSync(value, SALT_WORK_FACTOR);
            this.setDataValue('password', hash);
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
      },
      middleName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'middle_name'
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt:
      {
        type: Sequelize.DATE,
        field: 'created_at'
      },
  
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    }, {
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};