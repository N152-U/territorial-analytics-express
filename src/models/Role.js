/**
 * DeliveryService
 * @module src/models/Role
 * @name Role
 * @author Andrea Naraly Solis Martinez
 * @requires sequelize.DataTypes
 */
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Role = sequelize.define('roles', {

  /**
   * Role Model
   * @typedef {Object} module:Role.Role
   * @property {String} role Role Name.
   * @property {Boolean} [status=true] Status of Role (Optional).
   * @property {Timestamp} [timestamps] Timestamps of Role.
   *  Show only when getting  Role (Optional).
   */

     /**
     * @type {Role}
     */

    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
  Role.associate=function(models)
  {
      //1:1
      Role.hasOne(models.User, { foreignKey: 'roleId' });
  };
  return Role;
};
