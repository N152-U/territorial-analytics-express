const { Sequelize } = require('sequelize');

const sequelizePostgres = new Sequelize(
  process.env.DB_PSQL,
  process.env.USER_PSQL,
  process.env.PASSWORD_PSQL,
  {
    host: process.env.HOST_PSQL,
    port:  process.env.PORT_PSQL,
    dialect: 'postgres',
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

sequelizePostgres
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelizePostgres;
