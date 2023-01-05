/* const sequelizeMysql = require('../utils/mysqlClient.js'); */
const sequelizePostgres = require('../utils/postgresClient.js');

const Role = require('./Role.js')(sequelizePostgres);
const Permission = require('./Permission.js')(sequelizePostgres);
const RoleHasPermission = require('./RoleHasPermission.js')(sequelizePostgres);
const User = require('./User.js')(sequelizePostgres);

const UserLog = require('./UserLog.js')(sequelizePostgres);

try {

    //n:m
    Role.belongsToMany(Permission, {
        through: RoleHasPermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId'
    });

    Permission.belongsToMany(Role, {
        through: RoleHasPermission,
        foreignKey: 'permissionId',
        otherKey: 'roleId'
    });

    //1:1
    Role.hasOne(User, { foreignKey: 'roleId' });
    User.belongsTo(Role, { foreignKey: 'roleId', as: 'roles' });

    User.hasMany(UserLog, {
        as: 'user_logs',
    });

    UserLog.belongsTo(UserLog, {
        as: 'user',
    });

    /* Se encuentra comentada debido a que no es necesaria la sincronizacion con la tabla */
    /*   sequelizePostgres.sync();
    sequelizeMssql.sync(); */
    //sequelizePostgres.sync( /*{force: true}*/ );
    //const tMysql = async () => sequelizePostgres.transaction().then();
    //const tMssql = async () => sequelizeMssql.transaction().then();
    const tPostgres = async() => sequelizePostgres.transaction().then();
    module.exports = {
        //tMysql,
        // tMssql,
        tPostgres,
        Role,
        Permission,
        RoleHasPermission,
        User,
        UserLog
    };
} catch (error) {
    throw new Error(error);
}