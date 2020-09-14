const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let blogController = require('../controllers/blogController');

router.get('/', blogController.getBlog);

router.post('/create-blog', blogController.postBlog);

router.get('/:blogId', blogController.blogId);

router.patch('/:blogId', blogController.patchBlogId);

router.delete('/:blogId', blogController.deleteBlogId);

module.exports = router;

