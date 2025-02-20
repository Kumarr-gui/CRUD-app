const express = require('express');
// const bcrypt = require('bcrypt');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/employeeRegister',authController.employeeRegister);


module.exports = router;