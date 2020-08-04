const express = require('express');
const Router = require('express-promise-router')
const bodyParser = require('body-parser');
const crypto = require('crypto')
// const router = express.Router();
const router = new Router();

//---------------------- MYSQL Using POOL to Manage Connection & Disconnection -------------

// instead POOLING can handle all the connection and disconnection and we can query using pool
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'toor',
  database        : 'vuedb'
});

const dbpath = './users.json'

const fs = require('fs')

// async middleware to handle error for all the functions
const asyncMiddleware = func => (req, res, next) => {
    Promise
    .resolve(func(req, res, next))
    .catch(next);
  };


//create a new user info
router.post('/register', (req, res) => {   
    console.log(req.body) 
    pool.query('INSERT INTO userdb VALUES (?, ?, ?)', 
        [req.body.username, req.body.password, req.body.name], (error, results, fields) => {
            // console.log(fields)
            console.log(error)
            if (error) {
                console.log("Query errored....", error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            }            
            else {
                console.log("User Registered....")
                res.status(200).send("User Registered Successfully!!!")
            }
        }
    )
});

//updating an user info

// router.post('/login', async (req, res, next) => {
router.post('/login', (req, res) => {
    pool.query('SELECT * FROM userdb WHERE `username` = ? and `password` = ?', 
        [req.body.username, req.body.password], (error, results, fields) => {
            // console.log(fields)
            // console.log(results)
            if (error) {
                res.status(500).send("Not Authorized. Password Incorrect!!!")
            }
            if (results.length == 0){
                res.status(500).send("Username or Password Incorrect!!!")
            } else {
                var token = crypto.randomBytes(16).toString('hex');
                user_name = results[0].name
                res.status(200).send({auth:true, user: user_name, token: token})
            }
            
        }
    )
//-----------------------------

    // login(req.body.username, req.body.password)
    // console.log("Calling login func")
    // try{
    //     var result = await login(req.body.username, req.body.password)
    //     console.log("Data: ", result)
    //     // console.log("Error: ", result.error)
    //     res.status(200).send(result)
    // } catch (err) {
    //     console.log("Error: ", err)
    //     res.status(500).send("Server error")
    // }
    // console.log("Returned from login call")
});

// function login(user,pwd) {
//     pool.query('SELECT * FROM userdb WHERE `username` = ? and `password` = ?', 
//         [user, pwd], (error, results, fields) => {
//             console.log(fields)
//             console.log(results)
//             if (error) {
//                 res.status(500).send("Not Authorized. Password Incorrect!!!")
//                 console.log("Password mismatch!!")
//                 // return error
//             }
//             var token = crypto.randomBytes(16).toString('hex');
//             res.status(200).send({auth:true, user: results[RowDataPacket].name, token: token})
//             // return ({auth:true, user: results.name, token: token})
//         }
//     )
// }


module.exports = router ;