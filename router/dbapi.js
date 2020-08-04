const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const router = express.Router();

//----------------------------- MYSQL Connection ------------------------
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'toor',
  database : 'vuedb'
});

// connection.connect();
connection.connect(function(err) {
    if (err) {
      console.error('Error Connecting: ' + err.stack);
      return;
    }
   
    console.log('Connected as ' + connection.threadId);
  });

// can also create connection as below
var connection = mysql.createConnection(
    'mysql://root:toor@localhost/vuedb?debug=true&charset=BIG5_CHINESE_CI&timezone=-0700');


const dbpath = './users.json'

const fs = require('fs')


//create a new user info
router.post('/register', (req, res) => {
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        filedata = JSON.parse(data);
        // console.log(Object.keys(filedata), req.params.uid);
        // console.log(req.body);

        const newid = String(req.body.username)

        if (Object.keys(filedata).indexOf(req.body.username) == -1){
            // res.send('user not found!! Make entry for new user');
            const newinfo = {
                "name" : req.body.name,
                "password" : req.body.password                
            }
            filedata[newid] = newinfo

            fs.writeFile(dbpath, JSON.stringify(filedata, null, 2), 'utf8', (err) => {
                if (err) {
                    res.status(500).send(err);
                    // throw err;
                }
                res.status(200).send('User Registered');
            });
        }else{
            res.status(500).send("UserID already exists!!!");
        }
    });
});

//updating an user info

// ------------------- DB Connection URI

router.post('/login', (req, res) => {
    
    connection.query('SELECT * FROM userdb WHERE `username` = ? and `password` = ?', 
        [req.body.username, req.body.password], (error, results, fields) => {
            console.log(fields)
            console.log(results)
            if (error) {
                res.status(500).send("Not Authorized. Password Incorrect!!!")
            }
            var token = crypto.randomBytes(16).toString('hex');
            res.status(200).send({auth:true, user: results.name, token: token})
        }
    )
});


module.exports = router ;