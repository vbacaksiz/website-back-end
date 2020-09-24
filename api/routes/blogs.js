const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let blogController = require('../controllers/blogController');

router.get('/', blogController.getBlogs);

router.post('/create-blog', blogController.postBlog);

router.get('/:blogId', blogController.blogId);

router.post('/:blogId', blogController.blogUpdate);

router.delete('/:blogId', blogController.deleteBlogId);

module.exports = router;

