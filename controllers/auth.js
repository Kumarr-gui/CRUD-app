const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db'); 

exports.register = async (req,res) => {
    
//destructuring
    const {name ,email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email],async (err, results) =>{
        if(err){
            console.log(err);
            return res.render('register', { message: 'Database error' });
        }
        if(results.length > 0 ){
            return res.render('register',{
                message : 'Email already exists!!! Try different email',
            })
        } else if( password !== passwordConfirm){
            return res.render('register',{
                message : `Password doesn't match` 
        });
    }
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 8);
        // console.log('Hashed Password', hashedPassword);
    } 
    catch(error){
    console.log(error);
    return res.render('register', {
        message: 'Error while encrypting password',
    });
}

//query to insert data into users
db.query(
    'INSERT INTO users SET ?',
    { name: name, email: email, password: hashedPassword },
    (err, results) => {
        if (err) {
            console.log(err);
            return res.render('register', {
                message: 'Error while inserting user into database',
            });
        } else {
            console.log(results);
            return res.render('register', {
                message: 'User registered successfully',
            });
        }
    });
});
};

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login', {
                message: 'Please enter your details',
            });
        }
        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('An internal server error occurred');
            }
            if (results.length === 0) {
                console.log('No user found for email',email);
                return res.render('login',{
                    message:'Email or password is incorrect',
                    // return res.status(401).send('Email or Password is incorrect');
                });
            }
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.render('login', {
                    message: 'Email or Password is not correct',
                });
            }
            const token = jwt.sign({email:user.email, password:user.password},process.env.JWT_KEY,{expiresIn:'1000s'});
            console.log('JWT token:',token);

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',    
                maxAge: 60 * 60 * 1000
            });

            console.log('Token cookie set');
            res.redirect('/employees');
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An internal server error occurred');
    }
};



//---------------------------------------------------------------------------------------------------
//employee registration after login
// const { promisify } = require('util');
exports.employeeRegister = async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, phone, department } = req.body;
        if (!name || !email || !phone || !department) {
            return res.render('employeeRegister', {
                message: 'Please enter all required details',
            });
        }
db.query('SELECT email FROM employees WHERE email = ?',[email],async (err, results) => {
    if(err){
        console.log(err)
        return res.render('employeeRegister',{message: 'Database error'})
    }
    if(results.length > 0){
        return res.render('employeeRegister', {
            message: 'Email already exists!!! Try different email',
    });
}
})
    await db.query('INSERT INTO employees SET ?', { name, email, phone, department });
        return res.render('employeeRegister', { message: 'Employee registered successfully' });

    } catch (error) {
        console.error(error);
        return res.render('employeeRegister', { message: 'Server error. Please try again.' });
    }
};
