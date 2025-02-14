const express = require('express');
const router = express.Router();
const { cookiesJwtAuth } = require ('../middlewares/auth.js')

router.get('/',(req, res) =>{
    res.render("index");
});
 
router.get('/register',(req, res) =>{
    res.render("register");
});

router.get('/login',(req, res) =>{
    res.render('login');
});

router.get('/employees',cookiesJwtAuth,(req, res)=>{
    res.render('employees')
})
router.get('/editEmployee',(req, res) =>{
    res.render('editEmployee');
});

router.get('/employeeRegister',(req, res) =>{
    res.render('employeeRegister.hbs');
});

module.exports = router; 
