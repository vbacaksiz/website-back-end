const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let userController = require('../controllers/userController');

router.post('/signup', userController.userSignUp);

module.exports = router;
