module.exports = (sequelize, DataTypes, Model) => {
    class User extends Model { }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowedNull: false,
            unique: true,
        },

        username: {
            type: DataTypes.STRING,
            allowedNull: false,
            unique: true,
        },

        password: {
            type: DataTypes.STRING,
            allowedNull: false,
        },
    }, {
        sequelize,
        modelName: 'user',
    });

    return User;
};
