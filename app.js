const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const publicDirectory = path.join(__dirname,'./public')
const db = require('./db'); 


dotenv.config({path:'./.env'});

const app = express();
app.set('view engine', 'hbs');
app.set('views', './views'); 
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

app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, results) => {
      if (err) throw err;
      res.render("inner", { employees: results });
    });
  });
  
  // Route to delete an employee
  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
      if (err) throw err;
      res.redirect("/employees");
    });
  });
  
  // Route to update an employee (form submission)
  app.post("/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, email, phone ,department } = req.body;
    db.query(
      "UPDATE employees SET name = ?, email = ?, phone = ? , department = ?WHERE id = ?",
      [name, email, phone,department, id],
      (err, result) => {
        if (err) throw err;
        res.redirect("/employees");
      }
    );
  });



app.listen(process.env.PORT,()=>{
console.log('server started')
})





// app.get('/',(req, res) =>{
//     db.query('SELECT * FROM employees',(err, results) => {
//         console.log(results)
//         if(err){
//             console.error('Error fetching data:',err);
//             return res.status(500).send('DB error');
//         }
//         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>",employees )
//         res.render('inner',{employees: results});
//     });
// });