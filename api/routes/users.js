const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


let userController = require('../controllers/userController');
let middleware = require('../services/middleware');

router.post('/signup', middleware.signUpMiddleware
    , userController.userSignUp);

router.post('/login', middleware.loginMiddleware, userController.userLogin);

router.post('/', userController.getUserDetail);

router.get('/:userId', userController.getUserProfile);

router.get('/:userId/about', userController.aboutUser);

router.get('/:userId/update-profile', userController.updateProfile);

router.post('/:userId/update-profile', userController.updateProfilePost);

router.post('/:userId/update-profile-photo', userController.updateProfilePhoto);

module.exports = router;
 