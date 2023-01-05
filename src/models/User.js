const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Role } = require('.');

const SALT_WORK_FACTOR = 10;
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id'
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'middle_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    hash:{
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  User.associate = function (models) {
    //1:1
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'roles' });
  };
  return User;
};
