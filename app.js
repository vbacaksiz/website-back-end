const express = require('express');
const app = express();

const blogRoutes = require('./api/routes/blogs');

app.use('/blogs', blogRoutes);
   

module.exports = app;