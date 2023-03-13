/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');

const userController = require('./controller/user.controller');
const titleController = require('./controller/title.controller');
const watchlistController = require('./controller/watchlist.controller');

const app = express();
const port = 3070;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('App works!!');
});

app.listen(port, () => {
    console.log(`running server on from port:::::::${port}`);
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

app.get('/api/titles/:pageLength/:pageNum/:sortColumn/:search', (req, res) => {
    titleController
        .getPageOfTitles(req.params.pageLength, req.params.pageNum, req.params.sortColumn, req.params.search)
        .then((data) => res.json(data));
});

app.get('/api/titles/:pageLength/:pageNum/:sortColumn/', (req, res) => {
    titleController
        .getPageOfTitles(req.params.pageLength, req.params.pageNum, req.params.sortColumn, '')
        .then((data) => res.json(data));
});

app.get('/api/titles/withWatched/:userId/:pageLength/:pageNum/:sortColumn/:search', (req, res) => {
    titleController
        .getPageOfTitlesWithWatched(req.params.userId, req.params.pageLength, req.params.pageNum, req.params.sortColumn, req.params.search)
        .then((data) => res.json(data));
});

app.get('/api/titles/withWatched/:userId/:pageLength/:pageNum/:sortColumn/', (req, res) => {
    titleController
        .getPageOfTitlesWithWatched(req.params.userId, req.params.pageLength, req.params.pageNum, req.params.sortColumn, '')
        .then((data) => res.json(data));
});

app.post('/api/watchlist/', (req, res) => {
    watchlistController.createWatched(req.body.watched).then((data) => res.json(data));
});

app.put('/api/watchlist/', (req, res) => {
    watchlistController.updateWatched(req.body.watched).then((data) => res.json(data));
});

app.get('/api/watchlist/:userID/:pageLength/:pageNum/', (req, res) => {
    watchlistController
        .getPageOfWatched(req.params.userID, req.params.pageLength, req.params.pageNum, 'title')
        .then((data) => res.json(data));
});
