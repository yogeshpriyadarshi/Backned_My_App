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
  console.log("received data from frontend of task", req.body);
  const email = req.body.email;
  const title = req.body.title;
  const type = req.body.type;
  const value = req.body.value;
  const date = req.body.date; // "2025-05-04"
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
  const { email, date } = req.query;
  console.log(" viewtasks", email, date);
  try {
    const [rows] = await pool.query(
      "SELECT *, DATE_FORMAT(date,'%y-%m-%d') as formatted_date FROM task WHERE email=? AND date=?",
      [email, date]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/viewdaythought", async (req, res) => {
  let { email, date,} = req.query;
   console.log("view day thought",email,date)
   const dataCheck = await pool.query(
  "SELECT * FROM journal WHERE email=? AND date=?",
      [email, date]);
console.log("from table view thought", dataCheck);
  res.json(dataCheck);
})

app.post("/daythought", async (req, res) => {
  const data = req.body;
  console.log("Received for daythought from font", data);

  let { id, email, date, daythought,point } = req.body;
  // select * from journal where email and date
  // if (row.lenght> 1 ) upadate 
  // else insert
//  const [dataCheck] = await pool.query(
//   "SELECT * FROM journal WHERE email=? and date=?",[email, date]
//  );
//  console.log("lenght of data",dataCheck.length);

 if(id===0){
  console.log("daythougt insert",req.body)
 const [rows] = await pool.query(
    `INSERT INTO journal ( email, date, daythought, point) VALUES ( '${email}', '${date}','${daythought}','${point}')`);
    res.json({
      message: "insert daythought successfully!",
      success: true,
    });
}else{

  console.log("upload daythough ",req.body)
  const [row]= await pool.query(
    `UPDATE journal SET daythought = '${daythought}', point='${point}' WHERE id='${id}' `
  )
  res.json({
    message: "update dayThought  successfully!",
    success: true,
  });



}
  
});

app.post("/updatetask", async (req, res) => {
  console.log("update task table with point ", req.body);

  req.body.map(async (tasks, index) => { 
      if(tasks.point===null){tasks.point=0}
       if(tasks.remark === null){  tasks.remark=" "}
    const [rows] = await pool.query(
      `UPDATE task SET point = '${tasks.point}', remark = '${tasks.remark}' where task_id = '${tasks.task_id}' `
    );
  });
  // const [rows] = await pool.query(
  res.json({
    message: "update done",
    success: true,
  });
});


app.post("/setTarget", async (req, res) => {
console.log("yeartarget:",req.body);

const[row] = await pool.query(
   `INSERT INTO target ( email, type, year, month, firstDate, lastDate, target, customName) values
    ( '${req.body.email}', '${req.body.type}', '${req.body.year}', '${req.body.month}', '${req.body.firstDate}', '${req.body.lastDate}', '${req.body.setTarget}','${req.body.customName}' );`
)
res.json({
  message:"Target is Uploaded.",
  success: true
});

})

app.post("/seekTarget", async (req, res) => {
  try {
    console.log("type of custom",req.body);
    const [rows] = await pool.query(
      `SELECT * FROM target WHERE email= '${req.body.email}'`
  );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/uploadstatus", async (req, res) => {
  console.log("upload status:",req.body);
  
  const[row] = await pool.query(
     `INSERT INTO target_status ( email, targetName, date, status, id_target) VALUES
      ( '${req.body.email}', '${req.body.name}', '${req.body.date}', '${req.body.status}', '${req.body.id}' );`
  )
  res.json({
    message: "yes uploaded"
  })
  })

  

  // date
  // : 
  // "2025-05-22"
  // email
  // : 
  // "yogeshpriyadarshi55@gmail.com"
  // name
  // : 
  // "health 01"
  // status
  // : 
  // "fgsggf"


  app.post("/statusTarget", async (req, res) => {
    try {
      console.log("type of custom",req.body);
      const [rows] = await pool.query(
        `SELECT * FROM target_status WHERE id_target= '${req.body.id}'`
    );
      res.json(rows);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      res.status(500).json({ error: "Server error" });
    }
  });




app.listen(PORT, () => console.log("server started at 5000"));
