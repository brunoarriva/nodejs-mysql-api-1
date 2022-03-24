const jwt = require('jsonwebtoken');
const config = require('../../config/jwt');

module.exports = {

  validate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log('Verify Token::', req.headers.authorization);

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({
          status: false,
          message: err.message,
        });
      } else {
        req.body.userId = decoded.userId;
        req.body.username = decoded.username;
        req.body.role = decoded.role;
        next();
      }
    });
  },

  isTech: (req, res, next) => {
    if (!req.body.userId || req.body.role !== 'T') {
      res.status(401).json({
        status: false,
        message: 'Your profile does not match the required permission.',
      });
    } else {
      next();
    }
  },

  isManager: (req, res, next) => {
    if (!req.body.userId || req.body.role !== 'M') {
      res.status(401).json({
        status: false,
        message: 'Your profile does not match the required permission.',
      });
    } else {
      next();
    }
  },

};
