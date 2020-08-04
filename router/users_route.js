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

// async middleware to handle error for all the functions
const asyncMiddleware = func => (req, res, next) => {
    Promise
    .resolve(func(req, res, next))
    .catch(next);
  };


//get user(s)
router.get('/', (req, res) => {  
    // console.log(req.query, req.body)
    if (req.query.id) {
        // get single user
        // get_single_user(req.query.id)
        pool.query('SELECT * FROM users WHERE ID = ?', [req.query.id],
        (error, results, fields) => {
            // console.log(error)
            if(error) {
                console.log("Query Errored...", error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            } else {
                res.status(200).send(results[0])
            }
        })
    } else {
        pool.query('SELECT * FROM users', (error, results, fields) => {
            // console.log(error)
            if(error) {
                console.log("Query Errored...", error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            } else {
                res.status(200).send(results)
            }
        })
    }
    
});

//create a new user info
router.post('/', (req, res) => {   
    // console.log(req.body) 

    pool.query('INSERT INTO users (`username`, `state`, `password`, `Name`) VALUES (?, ?, ?, ?)', 
        [req.body.username, req.body.state, req.body.password, req.body.name], 
        (error, results, fields) => {
            // console.log(fields)
            console.log(error)
            if (error) {
                console.log("Query errored....", error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            }            
            else {
                console.log("User Added Successfully....")
                res.status(200).send("User Added Successfully!!!")
            }
        }
    )
});

//updating an user info
router.put('/', (req, res) => {
    console.log(req.body)
    pool.query('UPDATE users SET username = ?, password = ?, state = ?, Name = ? WHERE id = ?', 
        [req.body.username, req.body.password, req.body.state, req.body.name, req.body.id], 
        (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            } else {
                console.log("User Updated..!!")
                res.status(200).send("User Updated..!!")
            }            
        }
    )
});

//delete an user info
router.delete('/', (req, res) => {
    console.log(req.query)
    if (req.query.id) {
        pool.query('DELETE FROM users WHERE `ID` = ?', [req.query.id],
        (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage)
                res.status(500).send(error.sqlMessage)
            } else {
                if (results.length == 0) {
                    console.log("User not found")
                    res.status(500).send("No User Found!!")
                } else{
                    res.status(200).send("User Deleted...!!")
                }                
            }
        })
    }    
});

module.exports = router ;