const { check, validationResult } = require('express-validator');

exports.signUpMiddleware = [check('email', 'Email Error').
isEmail().
normalizeEmail(),
check('password', 'Password Error').
isLength({ min: 6 }),
check('firstName', 'First Name Required')
.not()
.isEmpty(),
check('lastName', 'Last Name Required')
.not()
.isEmpty(),
];