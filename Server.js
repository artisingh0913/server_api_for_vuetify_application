const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'Test';
app.set('port', PORT);
app.set('env', NODE_ENV);

// solved the req.body undefined issue
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
// app.use(express.json());

app.use(cors())

// app.use('/',require('./router/log_api.js'))
app.use('/',require('./router/pool_api.js'))
// app.use('/users',require('./router/route.js'))
app.use('/users',require('./router/users_route.js'))

// app.use(cors())

app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} Not Found`);
    err.status = 404;
    next(err);
});


app.listen(8080, () => {
  console.log(`Express Running on on Port ${app.get(
        'port'
      )} | Environment : ${app.get('env')}`
    );
});