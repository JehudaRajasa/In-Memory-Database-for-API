const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// router.get('/', (req, res, next) => {
//     var name = req.query.name;
//     console.log(name);
//     Product.findOne(name, function(err, docs) {
//     //    .exec()
//     //    .then(docs => {
//     //        console.log(err);
//     //        res.status(200).json(docs);
//     //   })
//     //    .catch(err => {
//     //        console.log(err);
//     //        res.status(500).json({
//     //            error: err
//      //       });
//      });
// });


/*
    SOLUTION HERE
 */
router.get('', (req, res, next) => {
    var name = req.query.name;

    if (!name) {
        Product.find({}, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({error: err});
            } else {
                console.log(result)
                res.status(200).json(result)
            }
        })

    } else {
        // Ref: https://mongoosejs.com/docs/api.html#model_Model.findOne
        Product.findOne({name: name}, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json({error: err});
            } else {
                console.log(result)
                res.status(200).json(result)
            }
        })
    }
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const  id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({message: 'No valid entry found for this ID'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(500).json({
               error: err 
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(500);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;