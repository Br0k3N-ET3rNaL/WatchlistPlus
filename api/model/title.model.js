module.exports = (sequelize, DataTypes, Model) => {
    class Title extends Model { }

    Title.init({
        id: {
            type: DataTypes.STRING,
            unique: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        releaseYear: {
            type: DataTypes.INTEGER,
        },
        ageCertification: {
            type: DataTypes.STRING,
        },
        runtime: {
            type: DataTypes.INTEGER,
        },
        genres: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
        productionCountries: {
            types: DataTypes.ARRAY(DataTypes.STRING),
        },
        seasons: {
            type: DataTypes.INTEGER,
        },
        imdbId: {
            type: DataTypes.STRING,
        },
        imdbScore: {
            type: DataTypes.DECIMAL(2, 1),
        },
        imdbVotes: {
            type: DataTypes.INTEGER,
        },
        tmdbPopularity: {
            type: DataTypes.DECIMAL(7, 3),
        },
        tmdbScore: {
            type: DataTypes.DECIMAL(5, 3),
        },
    }, {
        sequelize,
        modelName: 'title',
    });

    return Title;
};
