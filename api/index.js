const app = require('./server');

const port = 3070;

app.listen(port, () => {
    console.log(`running server on from port:::::::${port}`);
});
