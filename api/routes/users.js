const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


let userController = require('../controllers/userController');
let middleware = require('../services/middleware');

router.post('/signup', middleware.signUpMiddleware
    , userController.userSignUp);

module.exports = router;
 