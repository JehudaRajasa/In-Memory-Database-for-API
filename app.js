const express = require('express');
const app = express();
const morgan = require('morgan'); //Morgan is a middleware
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
    'mongodb+srv://Admin:' + process.env.MONGO_ATLAS_PW + '@api.t8twk.mongodb.net/<dbname>?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }
);

app.use(morgan('dev')); //Run morgan
app.use(bodyParser.urlencoded({extended: false})); //extended:true allows parsing body with rich data
app.use(bodyParser.json());

//Handling CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes handling requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(err.status || 500); //For any kinds of error
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;