const express = require('express');
const router = express.Router();

const jwtUtil = require('./app/util/jwtUtil');
const user = require('./routes/user');
const task = require('./routes/task');

// simple status check
router.get('/', (req, res) => res.status(200).json({
  status: true,
  timestamp: new Date().toJSON(),
}));

router.use('/user', user);
router.use('/task', jwtUtil.validate, task);

module.exports = router;
