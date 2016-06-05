var express = require('express');
var postRouter = express.Router();
var Post = require('../models/Post.js');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var imageHandler = require('../utils/ImageHandling');

//remember to change this link, everytime
//we restart ngrok.
//var noImageAvailLink = "http://036947fc.ngrok.io/images/noImage.jpg";

//get all posts
postRouter.get('/', function (req, res, next) {

    Post.find(function (err, thePosts) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(thePosts);
        }
    });
});

//Get a spicific users posts
postRouter.post('/myPosts', function (req, res, next) {

    var posterID = req.body.posterID;
    if (!posterID) {
        posterID = req.session.id;
    }

    Post.find({posterId: posterID}, function (err, thePosts) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(thePosts);
        }
    });
});


postRouter.post('/search', function (req, res, next) {

    var legoType = req.body.productTypeName;
    var maxprice = req.body.maxPrice;

    if (!maxprice) {
        maxprice = 100000;
    }
    if (!legoType) {
        legoType = "Angry Birds";
    }

    Post.find({productName: legoType, price: {$gt: 0, $lt: maxprice}}, function (err, thePosts) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(thePosts);
        }
    });
});

/*postRouter.post('/test', function (req, res, next) {
 console.log(req.body.price);
 console.log(req.body.title);
 console.log(req.body.type);
 console.log(req.body.city);
 console.log(req.body.posterId);
 res.send("lego Server:");
 });*/

//create new post
postRouter.post('/upload', function (req, res, next) {

    console.log("I POST");
    var newPost = new Post();

    newPost._id = new mongoose.mongo.ObjectID();
    newPost.title = req.body.title;  // set the users name (comes from the request)
    newPost.productName = req.body.type;
    newPost.price = req.body.price;
    newPost.posterId = new mongoose.mongo.ObjectID(req.body.posterId);
    newPost.postDate = new Date();

    console.log("post!: " + newPost.title + " " + newPost.price + " " + newPost.posterId + " " + newPost.productName);

    if (!newPost) {
        res.end("ErrorMessage: newPost is undefined or null");
        return;
    }

    //upload image
    if (req.body.image) {
        console.log("i upload");
        var imageLink = imageHandler.uploadFiles(req.body.image, newPost._id);
        newPost.imageLinks.push(imageLink);
    }
    else {
        newPost.imageLinks.push(path.join(__dirname, '../public/images/noImage.jpg'));
    }

    // save the post and check for errors
    newPost.save(function (err) {
        if (err) {
            console.log("mongooseError:" + err);
            res.send(err);
        }

        //res.json({message: newPost});
        res.send("Done");
    });
});

//delete post with id
postRouter.delete('/:postId', function (req, res, next) {

    var id = req.params.postId;
    Post.remove({_id: id}, function (err, thePost) {
        if (err) {
            res.send(err);
        }
        res.json({message: "The post with id " + id + " is now deleted!"});
    });
});

module.exports = postRouter;

