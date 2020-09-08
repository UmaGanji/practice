const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders'); 

console.log("In app js");

// logger middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://node-shop:node-shop@test-cluster.sjdp7.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
    });
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Method", "POST, PUT, PATCH, GET, DELETE");
        return res.status(200).json({});
    }
    next();
})
// To forward requests which has products in its route
app.use('/products', productRoutes);

// To forward routes to the orders
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
        error.status = 404;
    next(error);  
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

// middleware which process the request 
/*
app.use((req, res, next) => {
    res.status(200).json({
        message: "It works"
    });
});
*/
module.exports = app;