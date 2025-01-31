const express = require('express');
const router = express.Router();

router.get('/',(req, res) =>{
    res.render("index");
});
router.get('/register',(req, res) =>{
    res.render("register");
});
router.get('/login',(req, res) =>{
    res.render('login');
});
router.get('/inner',(req, res) =>{
    res.render('inner');
});
router.get('/employeeRegister',(req, res) =>{
    res.render('employeeRegister.hbs');
});
module.exports = router; 