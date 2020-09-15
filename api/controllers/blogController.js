const mongoose = require('mongoose');

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
    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        blogTitle: req.body.blogTitle,
        blogSubtitle: req.body.blogSubtitle,
        blogImg: req.body.blogImg,
        blogContent: req.body.blogContent,
        createdDate: Date.now()
    });
    blog.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Hello Blogs POST',
            createdBlog: blog,
        });
    }).catch(err => {
        console.log(err);
        res.status(406).json({
            error: err
        });
    });

};

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