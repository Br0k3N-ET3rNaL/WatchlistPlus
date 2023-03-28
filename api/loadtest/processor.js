// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

const statuses = ['Plan To Watch', 'Watching', 'Completed'];
const titleIds = ['tm1143265', 'ts38796', 'tm1067148'];

function selectRequest(context, ee, next) {
    const random = Math.floor(Math.random() * 100) + 1;
    let request;

    if (random <= 50) request = 0;
    else if (random <= 70) request = 1;
    else if (random <= 78) request = 2;
    else if (random <= 88) request = 3;
    else if (random === 89) request = 4;
    else if (random <= 99) request = 5;
    else request = 6;

    context.vars.request = request;

    return next();
}

function generateSignupData(context, ee, next) {
    context.vars.username = faker.internet.userName();
    context.vars.email = faker.internet.exampleEmail();
    context.vars.password = faker.internet.password();

    return next();
}

function generateWatchedData(requestParams, context, ee, next) {
    context.vars.rating = faker.datatype.number({ max: 10 });
    context.vars.status = statuses[Math.floor(Math.random() * 3)];
    context.vars.titleId = titleIds[Math.floor(Math.random() * 3)];

    return next();
}

function generateTitleData(requestParams, context, ee, next) {
    context.vars.titleId = titleIds[Math.floor(Math.random() * 3)];

    return next();
}

function generateReviewData(requestParams, context, ee, next) {
    context.vars.review = faker.lorem.paragraph();
    context.vars.titleId = titleIds[Math.floor(Math.random() * 3)];

    return next();
}

function generateRecommendationData(requestParams, context, ee, next) {
    context.vars.title1Id = titleIds[Math.floor(Math.random() * 3)];
    context.vars.title2Id = titleIds[Math.floor(Math.random() * 3)];

    return next();
}

module.exports = {
    selectRequest, generateSignupData, generateWatchedData, generateTitleData, generateReviewData, generateRecommendationData,
};
