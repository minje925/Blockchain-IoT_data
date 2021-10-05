var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'mingje925',
    port : 3306,
    database : 'iotdb'
});

connection.connect();

var app = express();

http.createServer(app).listen(3001, function() {
    console.log("Server running at 127.0.0.1:3001");
});

app.get('/', function(req, res) {
    fs.readFile("public/index.html", 'utf8', function(err, data) {
        if(err) {
            console.log("read file error.");
        }
        else {
            connection.query('select * from iotdata3', function(error, results) {
                if(error) {
                    console.log('sql error.');
                }
                else {
                    res.send(ejs.render(data, {rows : results}));
                }
            });
        }
    });
});
