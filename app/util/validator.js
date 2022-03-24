const {check, validationResult} = require('express-validator');

exports.checkUser = [
  check('username', 'Username is requied').not().isEmpty(),
  check('username', 'Username cannot exceed 64 chars.').isLength({max: 64}),
  check('password', 'Password is requied').not().isEmpty(),
  check('password', 'Password cannot exceed 255 chars').isLength({max: 255}),
  check('type', 'Type is requied').not().isEmpty(),
  check('type', 'Type should be either M (manager) or T (technician)')
      .isIn(['M', 'T']),
];

exports.checkLogin = [
  check('username', 'Username is required.').not().isEmpty(),
  check('password', 'Password is required.').not().isEmpty(),
];

exports.checkTask = [
  check('description', 'Description is required.').not().isEmpty(),
  check('description', 'Description cannot exceed 2500 chars.')
      .isLength({max: 2500}),
];

exports.checkResult = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422).json({
      status: false,
      message: 'Some fields do no match proper format.',
      data: errors.array(),
    });
    return false;
  }
  return true;
};
