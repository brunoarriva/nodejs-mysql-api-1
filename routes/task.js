const express = require('express');
const router = express.Router();

const controller = require('../app/api/controller/task');
const jwtUtil = require('../app/util/jwtUtil');
const {checkTask} = require('../app/util/validator');

router.get('/', controller.list);
router.post('/', [jwtUtil.isTech, checkTask], controller.create);
router.put('/:id', [jwtUtil.isTech, checkTask], controller.update);
router.delete('/:id', jwtUtil.isManager, controller.delete);

module.exports = router;
