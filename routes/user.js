const express = require('express');
const router = express.Router();

const controller = require('../app/api/controller/user');
const {checkUser, checkLogin} = require('../app/util/validator');

router.post('/create', checkUser, controller.create);
router.post('/auth', checkLogin, controller.authenticate);
router.get('/list', controller.list);

module.exports = router;
