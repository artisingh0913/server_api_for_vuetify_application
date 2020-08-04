const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const router = express.Router();
const fs = require('fs')

const dbpath = './users.json'


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
router.post('/login', (req, res) => {
    
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        filedata = JSON.parse(data);  
        // console.log("Request body: ", req.body)
        // console.log(req.body.username)  
        // console.log(req.body.password)  

        if (Object.keys(filedata).indexOf(req.body.username) == -1){
            res.status(500).send('user not found');
        }else{            
            if (filedata[req.body.username].password = req.body.password) {

                var token = crypto.randomBytes(16).toString('hex');

                user = filedata[req.body.username]
                
                res.status(200).send({auth:true, user: user.name, token: token})                
            } else {
                res.status(500).send("Not Authorized. Password Incorrect!!!")
            }
        }
    });
});


module.exports = router ;