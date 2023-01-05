const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoleHasPermission = sequelize.define('roles_has_permissions', {
    roleId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      field: 'role_id'
    },
    permissionId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
      field: 'permission_id'
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
    
  });
  return RoleHasPermission;
};
