/* eslint-disable global-require */
module.exports = (sequelize, DataTypes, Model) => {
    const Title = require('./title.model')(sequelize, DataTypes, Model);
    const User = require('./user.model')(sequelize, DataTypes, Model);

    class Watched extends Model { }

    Watched.init({
        rating: {
            type: DataTypes.INTEGER,
        },

        status: {
            type: DataTypes.STRING,
        },
    }, {
        sequelize,
        modelName: 'watched',
        freezeTableName: true,
    });

    Watched.belongsTo(Title);
    Watched.belongsTo(User);

    return Watched;
};
