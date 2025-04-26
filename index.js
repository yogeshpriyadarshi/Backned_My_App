const express = require('express');
// const users = require ("./MOCK_DATA.json");
const cors= require("cors");
const pool= require("./Database")

let app =express();
const PORT = 5000;
// console.log(users);
app.use(cors());
app.use(express.json());

// app.get("/users", async (req, res) => {
//   const [rows] = await pool.query('SELECT name FROM users');
//   return res.json(rows); 
// })


// Assuming you're using Express and mysql2
app.get("/users", async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT name, email, password FROM users');
      console.log(rows);
      res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/login", async (req, res) => {
  try {
    console.log(req.body);
      const [rows] = await pool.query(`SELECT name, email, password FROM users where email='${req.body.email}' and password='${req.body.password}' `);
      console.log(rows);
      if(rows.length>0)
      {
        res.json({
          message : "Login successfully!",
          user: rows[0],
          success:true
        })

      }else{
        res.json({
          message : "user not found!",
          success:false

        })
      }

  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post('/user', async (req, res) => {
     const data  = req.body;
     console.log('Received:' , data);

     let {Name,email,pass,number}=req.body;
     const [rows] = await pool.query(`INSERT INTO users (name, email, password, mobile) VALUES ('${Name}', '${email}', '${pass}','${number}')`);

    res.json({ message: 'Data received successfully!' });
  });

app.listen(PORT, ()=> console.log("server started at 5000"));
