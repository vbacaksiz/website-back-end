const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user/signup');
const { validationResult } = require('express-validator');
const blog = require('../models/blog');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

exports.userSignUp = (req, res, next) => {
    const errors = validationResult(req);
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(409).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash
                    });
                    if (!errors.isEmpty()) {
                        console.log(errors);
                        return res.status(409).json({
                            errors: errors.array()
                        })
                    } else {
                        user.save().then(result => {
                            res.status(201).json({
                                message: 'user created'
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(409).json({
                                error: err
                            });
                        });
                    }
                }
            });
        }
    });
};

exports.userLogin = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                    "" + process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: "1h"
                    }
                );
                return res.status(200).json({
                    message: 'Auth Successsful',
                    token: token,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    id: user[0]._id,
                    blogs: user[0].blog,
                    img: user[0].userImg
                });
            }
            res.status(401).json({
                message: 'Auth Failed'
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(409).json({
            error: err
        });
    });
};

exports.getUserDetail = (req, res, next) => {
    User.find({ _id: req.body.id }).exec().then(user => {
        console.log(user[0].blog);
        res.json(user[0].blog);
    }).catch(err => {
        console.log(err);
        res.status(409).json({
            error: err
        });
    });
};

exports.getUserProfile = async (req, res, next) => {
    User.find({ _id: req.params.userId }).exec().then(async (user) => {
        asyncForEach(user[0].blog, (userBlog) => {
            blog.find({ _id: userBlog }).exec().then(async (foundBlog) => {
                user[0].blogDetail.push(foundBlog[0].blogTitle);
                user[0].blogDetail.push(foundBlog[0].blogSubtitle);
                user[0].blogDetail.push(foundBlog[0].blogImg);
            });
        });
        await waitFor(1000);
        res.json(user[0]);
    }).catch(err => {
        console.log(err);
        res.status(409).json({
            error: err
        });
    })
}

exports.aboutUser = (req, res, next) =>{
    User.find({ _id: req.params.userId }).exec().then(user =>{
        res.json(user[0]);
    }).catch(err => {
        console.log(err);
        res.status(409).json({
            error: err
        });
    })
}

exports.updateProfile = (req, res, next) => {
    User.findById({ _id: req.params.userId }).exec().then(user => {
        res.json(user);
    }).catch(err => {
        console.log(err);
        res.status(409).json({
            error: err
        });
    })
}

exports.updateProfilePost = (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId).then(user => {
        user.socialMedia.splice(0,1, req.body.twitter);
        user.socialMedia.splice(1,1, req.body.facebook);
        user.socialMedia.splice(2,1, req.body.github);
        user.socialMedia.splice(3,1, req.body.instagram);
        user.about = req.body.about;
        user.userBackgroundImg = req.body.backgroundImg;
        console.log(user.socialMedia);
        user.save();
        res.status(201).json({
            message: 'Blog Updated Successfully',
        });
    }).catch(err => {
        console.log(err);
    })
}

exports.updateProfilePhoto = (req, res, next) => {
    User.findByIdAndUpdate(req.params.userId).then(user => {
        user.userImg = req.body.img;
        user.save();
        res.status(201).json({
            message: 'Blog Updated Successfully',
        });
    }).catch(err => {
        console.log(err);
    })
}