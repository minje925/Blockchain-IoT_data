var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var express = require('express');
var router = express.Router();

var app = express();

module.exports = function(app, fs);

var server = app.listen(3001, function(){
    console.log("Express server start for integrity check.");
});

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'mingje925',
    port : 3306,
    database : 'iotdb'
});

// db 연결
connection.connect();
/*
// db 쿼리
connection.query('select * from iotdata3', function(err, rows, field){
    if(!err)
        console.log('Data : ', rows);
    else
        console.log('Query error.', err);
});
*/
app.get("/view/list", function (req, res, next) {

    
    // db 쿼리
    connection.query('select * from iotdata3', function(err, rows, fields){
        if(err)
            console.log(err);
        else
        {
            console.log(rows);
            //res.render('iist', {title : 'DB Query '}); 
        }
            
    });
    
    module.express = router;
});
