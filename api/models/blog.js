const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    blogTitle: {type:String, required:true},
    blogSubtitle: String,
    blogContent: {type:String, required:true},
    createdDate: {type:Date, default:Date.now()}
});

module.exports = mongoose.model('Blog', blogSchema);