/* eslint-disable global-require */
module.exports = (sequelize, DataTypes, Model) => {
    const Title = require('./title.model')(sequelize, DataTypes, Model);
    const User = require('./user.model')(sequelize, DataTypes, Model);

    class Recommendation extends Model { }

    Recommendation.init({}, {
        sequelize,
        modelName: 'recommendation',
    });

    Recommendation.belongsTo(Title, { as: 'title1' });
    Recommendation.belongsTo(Title, { as: 'title2' });
    Recommendation.belongsTo(User);

    return Recommendation;
};
