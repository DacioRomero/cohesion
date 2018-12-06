// app.js
// DEPENDENCIES
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config({
    path: path.join(__dirname, '.env')
});

// MIDDLEWARE
const app = express();

app.engine('hbs', exphbs({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    defaultLayout: 'main'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/app', require('./controllers/app'));

// LISTENER
if (require.main === module) {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
}

module.exports = app;
