var express = require('express');
var userRouter = express.Router();
var User = require('../models/User.js');
var Post = require('../models/Post.js');

var serverLink = "";

//get all the user's posts.
userRouter.get('post/:userId', function (req, res, next) {

    var id = req.params.userId;

    Post.find({posterId: id}, function (err, thePosts) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(thePosts);
        }
    });
});

//get all users
userRouter.get('/', function (req, res, next) {

    User.find(function (err, userNames) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(userNames);
        }
    });
});

//get user with id.
userRouter.get('/:userId', function (req, res, next) {

    var id = req.params.userId;

    User.findById(id, function (err, theUser) {

        if (err) {
            res.send(err);
        }
        res.json({message: theUser});
    })
});

//delete user with id (will also delete users posts)
userRouter.delete('/:userId', function (req, res, next) {

    var id = req.params.userId;

    //removes all the posts associated with this user
    Post.remove({posterId: id}, function (err) {
        if (err) {
            res.send(err);
        }
        res.json({message: "The post with id " + id + " is now deleted!"});
    });

    //them removes the user
    User.remove({_id: id}, function (err, theUser) {
        if (err) {
            res.send(err);
        }
        res.json({message: "The post with id " + id + " is now deleted!"});
    });
});


//create new user.
userRouter.post('/signup', function (req, res, next) {

    var newUser = new User();

    newUser.username = req.body.newUserName;  // set the users name (comes from the request)
    newUser.password = req.body.newUserPassword;
    newUser.firstName = req.body.newFirstName;
    newUser.lastName = req.body.newLastName;

    if (!newUser.username) {
        res.send("ErrorMessage: Typed name is undefined or null");
        return;
    }

    // save the user and check for errors
    newUser.save(function (err) {
        if (err)
            res.send(err);

        res.json({message: newUser});
    });
});

userRouter.post("/login", function (req, res, next) {

    console.log(req.body.userName);
    console.log(req.body.userPassword);


    User.findOne({
        username: req.body.userName
    }, function (err, user) {
        console.log(user);
        if (err) throw err;
        if (!user) {
            res.send({msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.userPassword, function (err, isMatch) {
                if (isMatch && !err) {
// if user is found and password is right create a token
                    req.session.username = user.username;
                    req.session.id = user._id;
                    console.log("user authenticated");
                    res.send(user.username + "," + user._id);

                } else {
                    res.send({error: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

module.exports = userRouter;
