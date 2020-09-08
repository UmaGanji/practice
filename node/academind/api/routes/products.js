const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log("got documents...",docs);
        if(docs.length > 0){
            res.status(200).json(docs);
        }else{
            res.status(404).json({
                message: "No products found"
            });
        }
        
    })
    .catch(err => {
        console.log("error while fetching documets...",err);
        res.status(500).json({
            error: err
        });
    })
    
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
    .then(result => {
        console.log("after save... result..",result);
        res.status(201).json({
            message: "Product saved!",
            createdProduct: product
        });
    })
    .catch(err => {
        console.log("error...",err);
        res.status(500).json({
            error : err
        });
    })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then( doc => {
        if(doc){
            console.log("product fetched...",doc);
            res.status(200).json(doc);
        }
        else{
            console.log("product not found");
            res.status(404).json({
                message: "No product found for provided Id"
            });
        }
        
    })
    .catch( err => {
        console.log("error while getting a product... ", err);
        res.status(500).json(err);
    })
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    updateOps = {};
    for(const obj in req.body){
        updateOps[obj.propName] = ops.value;
    }
    Product.update({_id: id},{$set: updateOps})
    .exec()
    .then(result => {
        console.log("product updated ! ",result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log("error... ",err);
        res,status(500).json({
            error: err
        });
    })
    
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id:id
    })
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log("error while delteing...",err);
        res.status(500).json({
            error: err
        })
    })
    
});

module.exports = router;