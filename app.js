const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');
const publicDirectory = path.join(__dirname,'./public')
const db = require('./db'); 
const cookieParser = require('cookie-parser');
const { cookiesJwtAuth} = require ('./middlewares/mwauth');

dotenv.config({path:'./.env'});

const app = express();
app.set('view engine', 'hbs');
app.set('views', './views'); 
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const hbs = require('hbs');

db.connect((error)=>{
    if(error){
        console.log('Database connection failed',error);
    }   
    else{
    console.log('Database connection succesfull')
    }
})

app.use('/',require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
  
  // Route to delete an employee
  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
      if (err) throw err;
      res.redirect("/employees");
    });
  });
  
  // Route to update an employee (form submission)
  // app.post("/update/:id", (req, res) => {
  //   const id = req.params.id;
  //   const { name, email, phone ,department } = req.body;
  //   db.query(
  //     "UPDATE employees SET name = ?, email = ?, phone = ? , department = ?WHERE id = ?",
  //     [name, email, phone,department, id],
  //     (err, result) => {
  //       if (err) throw err;
  //       res.redirect("/employees");
  //     }
  //   );
  // });

// for pagination fetching all the data from the database in a single variable
  // app.get("/data", (req, res) => {
  //   const response = db.query("SELECT * FROM employees", (err, results) => {
  //     if (err) throw err;
  //     // return res.json("employees", { employees: results });
  //     return res.status(200).json({employees :results})
  //   });
  // });


  // Route to show the edit form
app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM employees WHERE id = ?', [id], (err, result) => {
      if (err) {
          console.log(err);
          return res.status(500).send('Error retrieving employee');
      }

      res.render('editEmployee', {
          employee: result[0]
      });
  });
});

// Route to handle the update form submission
app.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, phone, department } = req.body;
  db.query(
      'UPDATE employees SET name = ?, email = ?, phone = ?, department = ? WHERE id = ?',
      [name, email, phone, department, id],
      (err, result) => {
          if (err) throw err;
          res.redirect('/employees');
      }
  );
});


  // Register custom helpers for hbs
hbs.registerHelper('subtract', function (a, b) {
  return a - b;
});

hbs.registerHelper('add', function (a, b) {
  return a + b;
});

hbs.registerHelper('gt', function (a, b) {
  return a > b;
});

hbs.registerHelper('lt', function (a, b) {
  return a < b;
});


app.get("/employees", cookiesJwtAuth, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    if (!req.user) {
        return res.redirect('/login');
    }
    db.query("SELECT * FROM employees LIMIT ? OFFSET ?", [limit, offset], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error retrieving data');
        }
        db.query("SELECT COUNT(*) AS count FROM employees", (err, countResult) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error counting data');
            }
            const totalEmployees = countResult[0].count;
            const totalPages = Math.ceil(totalEmployees / limit);
            res.render("employees", {
                employees: results,
                currentPage: page,
                totalPages: totalPages,
            });
        });
    });
});



//Search functionality
app.get('/employees/search', (req, res) =>{
  try{
    //in try we have to collect the data using query
    const query = req.query.q;
    const SQL = "SELECT * FROM employees WHERE name LIKE ? OR email LIKE ? or phone LIKE ?";
    db.query(SQL,[`%${query}%`,`%${query}%`,`%${query}%`], (err, result) =>{
      if(result.length === 0){
         res.status(200).json({message : "No matching record found",length: result.length});
      }
      res.render("employees",{
        employees: result,
        currentPage: 1, 
        totalPages: 1,
      });
    });
  }catch(err){
    res.status(500).json({error: "Failed to search"})
  };
});

//server listening
app.listen(process.env.PORT,()=>{
console.log(`\nServer running at Port ${process.env.PORT}`)
});
