const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
})

exports.register = async (req,res) => {
    console.log(req.body,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  ")
//destructuring
    const {name ,email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email],async (err, results) =>{
        if(err){
            console.log(err);
            return res.render('register', { message: 'Database error' });
        }
        if(results.length > 0 ){
            return res.render('register',{
                message : 'Email is already in use',
            })
        } else if( password !== passwordConfirm){
            return res.render('register',{
                message : `Password doesn't match` 
        });
    }
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 8);
        console.log('Hashed Password', hashedPassword);
    } 
    catch(error){
    console.log(error);
    return res.render('register', {
        message: 'Error while encrypting password',
    });
}


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
    }
);
});
};
exports.login = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            // return res.status(400).send('Please provide email and password');
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
                return res.status(401).send('Email or Password is incorrect');
            }
            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.render('login', {
                    message: 'Email or Password is not correct',
                });
            }
            // Successful login - redirect or respond accordingly
            res.redirect('/inner');
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An internal server error occurred');
    }
};