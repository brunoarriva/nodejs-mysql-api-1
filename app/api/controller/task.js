const db = require('../../database/database');
const query = require('../model/task');
const crypt = require('../../util/cryptoUtil');
const kafka = require('../../util/kafkaProducer');
const {checkResult} = require('../../util/validator');

module.exports = {

  list: (req, res, next) => {
    const isManager = req.body.role === 'M';
    const userId = isManager ? null : req.body.userId;
    db.query(query.findAll, [userId], (err, result) => {
      if (err) next(err);
      else {
        if (isManager) {
          result.forEach((e) => {
            e.description = crypt.encrypt(e.description)?.content;
          });
        }
        res.status(200).json({
          status: true,
          message: result.length + ' registered task(s).',
          data: result,
        });
      }
    });
  },

  create: (req, res, next) => {
    if (!checkResult(req, res)) {
      return;
    }

    db.query(query.insert, [
      req.body.description,
      new Date(),
      new Date(),
      req.body.userId,
    ], (err, result) => {
      if (err) next(err);
      else {
        kafka.produce(result.insertId, req.body.username).catch((err2) => {
          console.error('Error in producer: ', err2);
        });
        res.status(201).json({
          status: true,
          message: 'Task Created!',
          data: result,
        });
      }
    });
  },

  update: (req, res, next) => {
    if (!checkResult(req, res)) {
      return;
    }

    db.query(query.update, [
      req.body.description,
      new Date(),
      parseInt(req.params.id),
      req.body.userId,
    ], (err, result) => {
      if (err) next(err);
      else {
        if (result.affectedRows === 0) {
          res.status(400).json({
            status: true,
            message: 'No Task was changed!',
          });
        } else {
          res.status(200).json({
            status: true,
            message: 'Task is up to date!',
          });
        }
      }
    });
  },

  delete: (req, res, next) => {
    db.query(query.delete, [
      parseInt(req.params.id),
      req.body.userId,
    ], (err, result) => {
      if (err) next(err);
      else {
        if (result.affectedRows === 0) {
          res.status(400).json({
            status: true,
            message: 'No Task was deleted!',
          });
        } else {
          res.status(200).json({
            status: true,
            message: 'Task was deleted.',
          });
        }
      }
    });
  },

};
