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
        await waitFor(200);
        res.json(result);
    })
}

exports.blogId = async(req, res, next) => {
    Blog.findById(req.params.blogId).then(async(result) => {   
        User.find({ _id: result.createdUser }).populate('user').exec((err, user) => {
            result.blogDetail.push(user[0].firstName);
            result.blogDetail.push(user[0].lastName);
        })
        await waitFor(100);
        res.json(result);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    })
};

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
            user[0].blog.push(result._id);
            user[0].save();
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

exports.deleteBlogId = async(req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId).then(async(result) => {
        User.findByIdAndUpdate(result.createdUser).then(async(user) => {
            let i=0;
            asyncForEach(user.blog, (blog) => {
                if(blog == req.params.blogId){
                    user.blog.splice(i,1);
                    return;
                }
                i++;
            })
            await waitFor(100);
            user.save();
            console.log(user.blog);
        });
        res.json(result);
    }).catch(err => {
        console.log(err);
    })
};

exports.blogUpdate = (req, res, next) => {
    Blog.findByIdAndUpdate(req.params.blogId).then(result => {
        result.blogTitle = req.body.blogTitle;
        result.blogSubtitle = req.body.blogSubtitle;
        result.blogImg = req.body.blogImg;
        result.blogContent = req.body.blogContent;
        result.save();
        res.status(201).json({
            message: 'Blog Updated Successfully',
        });
    }).catch(err => {
        console.log(err);
    })
}