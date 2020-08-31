const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const blogRoutes = require('./api/routes/blogs');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://volkan:'+ process.env.MONGO_ATLAS_PW + '@blogsite.inbqh.mongodb.net/blogSite?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/blogs', blogRoutes);
app.use('/user', userRoutes);
   

module.exports = app;