const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

let userController = require('../controllers/userController');

router.post('/signup', 
    [check('email', 'Email Error').
        isEmail().
        normalizeEmail(),
    check('password', 'Password Error').
        isLength({ min: 6 }),
    check('firstName', 'First Name Required')
        .not()
        .isEmpty(),
    check('lastName', 'Last Name Required')
        .not()
        .isEmpty(),
    ], userController.userSignUp);

module.exports = router;
