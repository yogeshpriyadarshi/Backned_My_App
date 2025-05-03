const express = require("express");
// const users = require ("./MOCK_DATA.json");
const cors = require("cors");
const pool = require("./Database");

let app = express();
const PORT = 5000;
// console.log(users);
app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT name, email, password FROM users");
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
    const [rows] = await pool.query(
      `SELECT * FROM users where email='${req.body.email}' and password='${req.body.password}' `
    );
    console.log(rows);
    if (rows.length > 0) {
      res.json({
        message: "Login successfully!",
        user: rows[0],
        success: true,
      });
    } else {
      res.json({
        message: "user not found!",
        success: false,
      });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/user", async (req, res) => {
  const data = req.body;
  console.log("Received:", data);

  let { Name, email, pass, number } = req.body;
  const [rows] = await pool.query(
    `INSERT INTO users (name, email, password, mobile) VALUES ('${Name}', '${email}', '${pass}','${number}')`
  );

  res.json({ message: "Data received successfully!" });
});

app.post("/todolist", async (req, res) => {
  console.log("received data from frontend of task", req.body.input);
  const email = req.body.input.email;
  const title = req.body.input.title;
  const type = req.body.input.type;
  const value = req.body.input.value;
  const date = req.body.input.date; // "2025-05-04"
  console.log("print date:", date);
  const [rows] = await pool.query(
    "INSERT INTO task (email, date, title, type, value) VALUES ( ?,?,?,?,? )",
    [email, date, title, type, value]
  );
  res.json({
    message: "update ToDOList successfully!",
    success: true,
    // user: rows[0]
  });
});

// let payload={
//     "name": "mk",
//     "email": "m@k.com",
//     "password": "mk",
//     "mobile": "75465522",
//     "dob": "2025-03-29",
//     "gender": "Male",
//     "country": "India",
//     "city": "pune",
//     "isLogin": true,
//     "id": 9
// }
app.post("/updateprofile", async (req, res) => {
  try {
    const [row] = await pool.query(
      `UPDATE users set name='${req.body.name}', mobile='${req.body.mobile}', dob='${req.body.dob}',
        gender='${req.body.gender}', country='${req.body.country}', city='${req.body.city}'  where email='${req.body.email}'`
    );
    const [rows] = await pool.query(`
      SELECT * FROM users WHERE email = '${req.body.email}' `);
    console.log("update row form tabel", rows);
    res.json({
      message: "update profile successfully!",
      success: true,
      user: rows[0],
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/viewtasks", async (req, res) => {
 const {email, date} = req.query;
 console.log("email and date that came form frontend",email, date);
  try {
    const [rows] = await pool.query("SELECT * FROM task WHERE email=? AND date=?",[email,date]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/daythought", async (req, res) => {
  const data = req.body;
  console.log("Received for daythought", data);

  let { email, date, daythought } = req.body;
  const [rows] = await pool.query(
    `INSERT INTO journal ( email, date, daythought) VALUES ( '${email}', '${date}','${daythought}')`
  );
  res.json({
    message: "update profile successfully!",
    success: true,
  });
})

app.listen(PORT, () => console.log("server started at 5000"));
