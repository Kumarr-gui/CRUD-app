const express = require('express');
const db = require('../db'); 
const bcrypt = require('bcrypt');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register',authController.register);
router.post('/login',authController.login);


module.exports = router;