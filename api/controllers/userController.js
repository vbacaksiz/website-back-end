const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.userSignUp = (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: 'Mail exists'
            });
        }else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result =>{
                        console.log(result);
                        res.status(200).json({
                            message:'user created'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
};