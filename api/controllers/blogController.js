const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const User = require('../models/user/signup');
const Blog = require('../models/blog');

exports.getBlogs = (req, res) => {
    Blog.find().then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    })
}

exports.postBlog = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        const blog = new Blog({
            _id: new mongoose.Types.ObjectId(),
            blogTitle: req.body.blogTitle,
            blogSubtitle: req.body.blogSubtitle,
            blogImg: req.body.blogImg,
            blogContent: req.body.blogContent,
            createdDate: Date.now(),
        });
        blog.createdUser.push(user[0]._id, user[0].firstName, user[0].lastName);
        blog.save().then(result => {
            user[0].blog.push(result._id);
            user[0].save();
            console.log(user[0].blog);
            res.status(201).json({
                message: 'Hello Blogs POST',
                createdBlog: blog,
            });
        }).catch(err => {
            console.log(err);
            res.status(406).json({
                error: err
            });
        }).catch(err => {
            console.log(err);
            res.status(406).json({
                error: err
            });
        });
    });
}

exports.blogId = (req, res, next) => {
    const id = req.params.blogId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID'
        });
    }
};

exports.patchBlogId = (req, res, next) => {
    res.status(200).json({
        message: 'Updated blog!'
    });
};

exports.deleteBlogId = (req, res, next) => {
    res.status(200).json({
        message: 'Deleted blog!'
    });
};