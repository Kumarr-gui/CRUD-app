const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config({path:'./.env'});

const app = express();
app.set('view engine', 'hbs');
app.set('views', './views'); 
   
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE
})
const publicDirectory = path.join(__dirname,'./public')
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: true}));
app.use(express.json());


db.connect((error)=>{
    if(error){
        console.log('Database connection failed',error);
    }   
    else{
    console.log('Database connected')
    }
})
app.use('/',require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(8000 ,()=>{
console.log('server started')
})