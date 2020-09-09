const { check, validationResult } = require('express-validator');

exports.signUpMiddleware = [check('email', 'Email Error').
    isEmail().
    normalizeEmail(),
check('password', 'Password Error').
    isLength({ min: 7 }),
check('firstName', 'First Name Required')
    .not()
    .isEmpty(),
check('lastName', 'Last Name Required')
    .not()
    .isEmpty(),
];

exports.loginMiddleware = [check('email', 'Email Error').
    isEmail().
    normalizeEmail(),
check('password', 'Password Error').
    isLength({ min: 7 }),
];