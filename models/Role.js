'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //1:1
      Role.hasOne(models.User, { foreignKey: 'roleId' });
      //n:m
      Role.belongsToMany(Permission, {
        through: RoleHasPermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId'
      });
    }
  };
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hash:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};