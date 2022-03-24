const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../database/database');
const query = require('../model/user');
const config = require('../../../config/jwt');
const {checkResult} = require('../../util/validator');

const saltRounds = 10;

module.exports = {
  list: (req, res, next) => {
    db.query(query.findAll, (err, result) => {
      if (err) next(err);
      else {
        res.status(200).json({
          status: true,
          message: result.length + ' registered user(s).',
          data: result,
        });
      }
    });
  },

  create: (req, res, next) => {
    if (!checkResult(req, res)) {
      return;
    }

    db.query(query.findByUsername, req.body.username, (err, result) => {
      if (err) next(err);
      else if (result?.length) {
        res.status(409).json({
          status: false,
          message: 'Username already in use.',
        });
      } else {
        db.query(query.insertUser, [
          true,
          req.body.username,
          bcrypt.hashSync(req.body.password, saltRounds),
          req.body.type,
        ], (err2, result2) => {
          if (err2) next(err2);
          else {
            res.status(201).json({
              status: true,
              message: 'User Created!',
              data: result2,
            });
          }
        });
      }
    });
  },

  authenticate: (req, res, next) => {
    if (!checkResult(req, res)) {
      return;
    }

    db.query(query.findByUsername, req.body.username, (err, result) => {
      if (err) {
        next(err);
      }

      if (result?.length === 1 &&
          result[0]?.active === 1 &&
          bcrypt.compareSync(req.body.password, result[0]?.password)
      ) {
        const token = jwt.sign(
            {
              userId: result[0].id,
              username: result[0].username,
              role: result[0].type,
            },
            config.secret,
            {expiresIn: config.tokenLife},
        );
        res.status(200).json({
          status: true,
          message: 'User authenticated!',
          data: {token: token},
        });
      } else {
        res.status(401).json({
          status: false,
          message: 'Invalid credentials.',
          data: null,
        });
      }
    });
  },

};
