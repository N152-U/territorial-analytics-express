const { Sequelize } = require('sequelize');

const sequelizeMssql = new Sequelize(
  process.env.DB_MS,
  process.env.USER_MS,
  process.env.PASSWORD_MS,
  {
    host: process.env.HOST_MS,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: false,
        validateBulkLoadParameters: true,
      },
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

sequelizeMssql
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelizeMssql;
