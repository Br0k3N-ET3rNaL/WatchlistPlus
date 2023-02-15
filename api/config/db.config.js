const { Sequelize, Model, DataTypes } = require('sequelize');

const connect = () => {
    const hostName = 'localhost';
    const userName = 'postgres';
    const password = 'password';
    const database = 'watchlist';
    const dialect = 'postgres';

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect,
        operatorsAliases: false,
        define: {
            timestamps: false,
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 20000,
            idle: 5000,
        },
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    // eslint-disable-next-line global-require
    db.user = require('../model/user.model')(sequelize, DataTypes, Model);
    // eslint-disable-next-line global-require
    db.title = require('../model/title.model')(sequelize, DataTypes, Model);

    return db;
};

module.exports = {
    connect,
};
