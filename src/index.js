const app = require('./app/app');

//puerto por variable de entorno o establecida
const port = process.env.PORT || 3900;

app.listen(port, () => {
    console.log(`------------------server running at http://localhost:${port}`);
});