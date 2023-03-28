/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userController = require('./controller/user.controller');
const titleController = require('./controller/title.controller');
const watchlistController = require('./controller/watchlist.controller');
const reviewController = require('./controller/review.controller');
const recommendationController = require('./controller/recommendation.controller');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('App works!!');
});

app.get('/api/users/exists/username/:username', (req, res) => {
    userController.usernameExists(req.params.username).then((data) => res.json(data));
});

app.get('/api/users/exists/email/:email', (req, res) => {
    userController.emailExists(req.params.email).then((data) => res.json(data));
});

app.get('/api/users/verify/:email/:password', (req, res) => {
    userController.verifyUser(req.params.email, req.params.password).then((data) => res.json(data));
});

app.post('/api/users/', (req, res) => {
    userController.createUser(req.body.user).then((data) => res.json(data));
});

app.get('/api/titles/page/:pageLength/:pageNum/:sortColumn/:search', (req, res) => {
    titleController
        .getPageOfTitles(req.params.pageLength, req.params.pageNum, req.params.sortColumn, req.params.search)
        .then((data) => res.json(data));
});

app.get('/api/titles/page/withWatched/:userId/:pageLength/:pageNum/:sortColumn/:search', (req, res) => {
    titleController
        .getPageOfTitlesWithWatched(req.params.userId, req.params.pageLength, req.params.pageNum, req.params.sortColumn, req.params.search)
        .then((data) => res.json(data));
});

app.get('/api/titles/verify/:title/', (req, res) => {
    titleController.verifyTitle(req.params.title).then((data) => res.json(data));
});

app.get('/api/titles/verify/:title/:type/:releaseYear/', (req, res) => {
    titleController.verifyTitle(req.params.title, req.params.type, req.params.releaseYear).then((data) => res.json(data));
});

app.post('/api/watchlist/', (req, res) => {
    watchlistController.createWatched(req.body.watched).then((data) => res.json(data));
});

app.put('/api/watchlist/', (req, res) => {
    watchlistController.updateWatched(req.body.watched).then((data) => res.json(data));
});

app.get('/api/watchlist/:userId/:pageLength/:pageNum/:sortColumn/:filter/', (req, res) => {
    watchlistController
        .getPageOfWatched(req.params.userId, req.params.pageLength, req.params.pageNum, req.params.sortColumn, req.params.filter)
        .then((data) => res.json(data));
});

app.delete('/api/watchlist/:userId/:titleId/', (req, res) => {
    watchlistController.deleteWatched(req.params.userId, req.params.titleId).then((data) => res.json(data));
});

app.post('/api/reviews/', (req, res) => {
    reviewController.createReview(req.body.review).then((data) => res.json(data));
});

app.get('/api/reviews/:titleId/:pageLength/:pageNum/', (req, res) => {
    reviewController.getPageOfReviews(req.params.titleId, req.params.pageLength, req.params.pageNum).then((data) => res.json(data));
});

app.post('/api/recommendations/', (req, res) => {
    recommendationController.createRecommendation(req.body.recommendation).then((data) => res.json(data));
});

app.get('/api/recommendations/:titleId/:pageLength/:pageNum/', (req, res) => {
    recommendationController.getPageOfRecommendations(req.params.titleId, req.params.pageLength, req.params.pageNum).then((data) => res.json(data));
});

module.exports = app;
