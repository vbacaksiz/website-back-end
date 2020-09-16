const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user/signup');
const { validationResult } = require('express-validator');

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
                            console.log(result);
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
                    id: user[0]._id
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