const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const dbpath = './db.json'

const fs = require('fs')

function get_user({username}) {
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        if (req.query.uid == null) {
            res.send(JSON.parse(data));
        }else{
            filedata = JSON.parse(data);
            // console.log(Object.keys(filedata), req.params.uid);
            // console.log(filedata[req.params.uid]);
    
            if (Object.keys(filedata).indexOf(req.query.uid) == -1){
                res.send('user not found');
            }else{
                res.send(filedata[req.query.uid]);
            }
        }
        // res.send(JSON.parse(data));
    });
    return user
}

// //get all user data
// router.get('/', (req, res) => {
//     // req.query.id ---> check for that ???
//     var res = await get_user(req)
//     //TODO: create a function for multiple
//     // res.status(send(filedata[req.query.uid]);
// });

//get all user data
router.get('/', (req, res) => {
    // req.query.id ---> check for that ???
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        if (req.query.uid == null) {
            res.send(JSON.parse(data));
        }else{
            filedata = JSON.parse(data);
            // console.log(Object.keys(filedata), req.params.uid);
            // console.log(filedata[req.params.uid]);
    
            if (Object.keys(filedata).indexOf(req.query.uid) == -1){
                res.send('user not found');
            }else{
                res.send(filedata[req.query.uid]);
            }
        }
    });
});

// // req.query would dummy this out
// //get single user data
// router.get('/:uid', (req, res) => {
//     fs.readFile(dbpath, 'utf8', (err, data) => {
//         if (err) {
//             throw err;
//         }

//         filedata = JSON.parse(data);
//         // console.log(Object.keys(filedata), req.params.uid);
//         // console.log(filedata[req.params.uid]);

//         if (Object.keys(filedata).indexOf(req.params.uid) == -1){
//             res.send('user not found');
//         }else{
//             res.send(filedata[req.params.uid]);
//         }
//     });
// });


//create a new user info
router.post('/', (req, res) => {
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        filedata = JSON.parse(data);
        // console.log(Object.keys(filedata), req.params.uid);
        // console.log(filedata[req.params.uid]);

        const newid = String(req.body.id)

        if (Object.keys(filedata).indexOf(req.params.uid) == -1){
            // res.send('user not found');
            const newinfo = {
                "id" : req.body.id,
                "username" : req.body.username,
                "password" : req.body.password
            }
            filedata[newid] = newinfo

            fs.writeFile(dbpath, JSON.stringify(filedata, null, 2), 'utf8', (err) => {
                if (err) {
                    res.status(500).send("Database Update Error!!")
                    throw err;
                }
                res.status(200).send(newinfo);
            });
        }else{
            res.status(500).send("UserID already exists!!!");
        }
    });
});

//updating an user info
router.post('/:uid', (req, res) => {
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        filedata = JSON.parse(data);
        // console.log(Object.keys(filedata), req.params.uid);
        // console.log(filedata[req.params.uid]);

        // const newid = String(req.body.id)

        if (Object.keys(filedata).indexOf(req.params.uid) == -1){
            res.send('user not found');
        }else{
            // res.send("UserID already exists!!!");
            const updateinfo = {
                "id" : req.body.id,
                "username" : req.body.username,
                "password" : req.body.password
            }
            filedata[req.body.id] = updateinfo

            fs.writeFile(dbpath, JSON.stringify(filedata, null, 2), 'utf8', (err) => {
                if (err) {
                    throw err;
                }
                res.status(200).send('User Info Updated');
            });
        }
    });
});

//deleting an user info
router.post('/:uid', (req, res) => {
    fs.readFile(dbpath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }

        filedata = JSON.parse(data);
        // console.log(Object.keys(filedata), req.params.uid);
        // console.log(filedata[req.params.uid]);

        // const newid = String(req.body.id)

        if (Object.keys(filedata).indexOf(req.params.uid) == -1){
            res.status(500).send('user not found');
        }else{
            // res.send("UserID already exists!!!");
            delete filedata[req.params.uid]

            fs.writeFile(dbpath, JSON.stringify(filedata, null, 2), 'utf8', (err) => {
                if (err) {
                    throw err;
                }
                res.status(200).send('User Info Deleted');
            });
        }
    });
});

module.exports = router ;