const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const User = require('../models/user/signup');
const Blog = require('../models/blog');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

exports.getBlogs = async(req, res) => {
    Blog.find().then(async(result) => {
        asyncForEach(result, (blog) => {
            User.find({ _id: blog.createdUser }).populate('user').exec((err, user) => {
                blog.blogDetail.push(user[0].firstName);
                blog.blogDetail.push(user[0].lastName);
            })
        })
        await waitFor(500);
        res.json(result);
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
            createdUser: user[0]._id
        });
        blog.save().then(result => {
            console.log(blog.createdUser);
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