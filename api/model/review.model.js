/* eslint-disable global-require */
module.exports = (sequelize, DataTypes, Model) => {
    const Title = require('./title.model')(sequelize, DataTypes, Model);
    const User = require('./user.model')(sequelize, DataTypes, Model);

    class Review extends Model { }

    Review.init({
        username: {
            type: DataTypes.STRING,
            references: {
                model: 'user',
                key: 'username',
            },
        },

        review: {
            type: DataTypes.TEXT,
        },
    }, {
        sequelize,
        modelName: 'review',
    });

    Review.belongsTo(Title);
    Review.belongsTo(User);

    return Review;
};
