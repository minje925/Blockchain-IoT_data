var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var express = require('express');
var router = express.Router();

var app = express();

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

// db 쿼리
connection.query('select * from iotdata3', function(err, rows, field){
    if(!err)
        console.log('Data : ', rows);
    else
        console.log('Query error.', err);
});

router.get("/list:page", function (req, res, next) {
    // 웹페이지 html 연결
    fs.readFile("public/index.html", 'utf8', function (err, data) {
        if(err) {
           //retrun console.error(err);
        }
        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(data, "utf-8");
        console.log(data);
    });
    // db 쿼리
    connection.query('select * from iotdata3', function(err, rows, field){
        if(err)
            console.log(err);
        else
            res.render('iist', {title : 'DB 데이터 전체 조회', rows: rows});
    });
    
    module.express = router;
});
