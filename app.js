const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(__dirname + '/dist/bbooks'));
app.use(express.static(path.join(__dirname + '/node_modules')));

app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('/*', function (req, res) {
    res.sendFile('index.html', { root: 'dist/bbooks/' });
});

// HTTP listener
app.listen(process.env.PORT || 8080, function () {
    console.log('Bbooks running on port ' + process.env.PORT);
});
module.exports = app;
