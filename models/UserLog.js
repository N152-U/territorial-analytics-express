const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserLog = sequelize.define('users_log', {
    ipLogin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserLog;
};
