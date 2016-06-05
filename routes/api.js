/**
 * Created by martins on 5/23/16.
 */
var express = require('express');
var User = require('../models/User.js');
var bodyParser = require('body-parser');

var REST = express.Router();

REST.use(bodyParser.urlencoded({extended: false}));

//get all bears
REST.get('/users', function (req, res, next) {

    Bear.find(function (err, bearNames) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(bearNames);
        }
    });
});

//add new bear


//select single bear with id
REST.get('/bears/:bearId', function (req, res, next) {

    var id = req.params.bearId;

    Bear.findById(id, function (err, theBear) {

        if (err) {
            res.send(err);
        }
        res.json({message: 'The bear with id ' + id + ' has the name: ' + theBear.name});
    })
});

//update bear with id
REST.put('/bears/:bearId', function (req, res, next) {

    var oldValue = "";
    var id = req.params.bearId;

    Bear.findById(id, function (err, theBear) {

        if (err) {
            res.end(err);
        }
        oldValue = theBear.name;
        theBear.name = req.body.name;

        theBear.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({message: "The bear with id " + id + ", got the name changed from " + oldValue + " to: " + theBear.name})
        });
    });
});

//delete bear with id
REST.delete('/bears/:bearId', function (req, res, next) {

    var id = req.params.bearId;
    Bear.remove({_id: id}, function (err, theBear) {
        if (err) {
            res.send(err);
        }
        res.json({message: "The bear with id " + id + " is now deleted!"});
    });
});

module.exports = REST;

/*
 Route 	HTTP Verb 	Description
 /api/bears 	GET 	Get all the bears.
 /api/bears 	POST 	Create a bear.
 /api/bears/:bear_id 	GET 	Get a single bear.
 /api/bears/:bear_id 	PUT 	Update a bear with new info.
 /api/bears/:bear_id 	DELETE 	Delete a bear.*/
