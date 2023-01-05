'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //1:1
      User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'roles' });
    }
  };
  User.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'role_id'
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};