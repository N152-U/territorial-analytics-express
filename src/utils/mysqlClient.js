const { Sequelize } = require('sequelize');

const sequelizeMysql = new Sequelize(
  process.env.DB_MYSQL,
  process.env.USER_MYSQL,
  process.env.PASSWORD_MYSQL,
  {
    host: process.env.HOST_MYSQL,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

sequelizeMysql
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch( err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelizeMysql;
