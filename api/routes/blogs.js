const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello Blogs GET'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'Hello Blogs POST'
    });
});

module.exports = router;

