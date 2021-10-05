var mysql = require('mysql');
var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var crypto = require('crypto');

// klaytn rpc 연결
const Caver = require('caver-js');
const caver = new Caver('http://localhost:8551/');

// 무결성 검사에 필요한 블록체인에 저장된 input값을 Array 형태로 저장
var b_hash_data = new Array();
// 위변조된 데이터 저장하는 변수
var error_hash_data = new Array();
caver.klay.getBlockNumber().then(console.log);

// mysql 연결
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'mingje925',
    port : 3306,
    database : 'iotdb'
});

connection.connect();

// server
var app = express();

// server start
http.createServer(app).listen(3001, function() {
    console.log("Server running at 127.0.0.1:3001");
});

// index.html이 열릴 때
app.get('/', function(req, res) {
    fs.readFile("public/index.html", 'utf-8', function(err, data) {
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
                    console.log(results.length); // 전체 행의 길이, 검사할 때 반복 횟수..
                   
                    //var b_hash_data = new Array();
                    var hash_data = new Array();
                    for(var i = 0; i<results.length; i++) {
                        
                        // mysql에서 컬럼을 불러와서 따로 저장
                        tx_hash = results[i]['txhash'];
                        time = results[i]['time'];
                        data = results[i]['data'];
                        // 해시하기 위한 값으로 저장 ex) 1594561231;36;54 -> 0xfsdfsd...
                        data = time+";"+data;
                        hash_data[i] = Tohash(data);
                        //console.log("db의 데이터 해시값",hash_data[i]);
                        getTransaction(tx_hash, i).then(()=>{
                            //do sonmething..
                            
                            //print_b_hash();
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }

                    integrity_check(hash_data, b_hash_data, results.length, results).then(()=>{
                        // do something..
                    }).catch(err=>{
                        console.log(err);
                    })
                    
                }
            });
        }
    });
});

function Tohash(origin_str) {
    // str을 해시값으로 변환하여 리턴하는 함수
    var hash = crypto.createHash('sha256');
    hash.update(origin_str);
    var output = hash.digest('hex');
    
    //console.log("해시 함수 내의 데이터 : ", origin_str);
    return "0x"+output;
}

// 해시 값으로 트랜잭션을 가져와 input을 추출하여 array에 저장
function getTransaction(hash, arrIdx){
    return new Promise((resolve, reject)=>{
        caver.klay.getTransaction(hash)
        .then(function (reciept) {
            b_hash_data[arrIdx] = reciept['input'];
            //console.log("b_hash : ",b_hash_data);
            resolve() 
        })
        .catch(err=>{
            reject(err)
        })
    })
}

function print_b_hash() {
    console.log("b_hash : ",b_hash_data);
}

// b_hash_data[]에 데이터 저장이 다되면 전체 array를 출력하는 함수
function integrity_check(db_data, b_data, data_leng, rows) {
    return new Promise(function(resolve, reject) {
        if(data_leng==b_data.length) {

            console.log("db_data : ", db_data);
            console.log("b_data", b_data);

            var j = 0;
            console.log("                  [      TIME      |  DATA   |                              TXHASH                                 ]");
            console.log("--------------------------------------------------------------------------------------------------------------------");
            for(var i = 0; i<data_leng; i++) {
                if(db_data[i] != b_data[i]) {
                    /*
                    error_hash_data[j] = j;
                    j++;
                    */
                   console.log(i+ ". Changed Data   [",rows[i].time, " | ", rows[i].data, " | ",rows[i].txhash, "]"); 
                }
                else {
                    console.log(i+".       OK       [                |         |                                                                     ]");
                }
            }
            resolve();
        } else {
            reject();
        }
    });
}

