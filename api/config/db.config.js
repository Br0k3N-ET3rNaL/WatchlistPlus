/* eslint-disable global-require */
const {
    Sequelize, Model, DataTypes,
} = require('sequelize');

const connect = () => {
    const hostName = 'localhost';
    const userName = 'postgres';
    const password = 'password';
    const database = 'watchlist';
    const dialect = 'postgres';

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect,
        logging: false,
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
    db.Op = Sequelize.Op;
    db.user = require('../model/user.model')(sequelize, DataTypes, Model);
    db.title = require('../model/title.model')(sequelize, DataTypes, Model);
    db.watched = require('../model/watchlist.model')(sequelize, DataTypes, Model);
    db.review = require('../model/review.model')(sequelize, DataTypes, Model);
    db.recommendation = require('../model/recommendation.model')(sequelize, DataTypes, Model);

    return db;
};

module.exports = {
    connect,
};
