const dbs = require("../config/dbs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const uuid_user = require("../Utils/uuid_data");
const uuid_data = require("../Utils/uuid_data");

exports.register = (req, res) => {
  const insertQuery = `INSERT INTO studtentsdata_dbs.user (uuid,name,email,password,role) VALUES ('${uuid_user()}','${
    req.body.name
  }','${req.body.email}','${req.body.password}','user')`;

  dbs.query(insertQuery, (insertError, insertResult) => {
    if (insertError) {
      console.error("Error inserting student:", insertError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    console.log("1 record inserted");
    res.status(200).json({ message: "Student inserted successfully" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const selectQuery = `SELECT * FROM studtentsdata_dbs.user WHERE email = '${email}' AND password = '${password}'`;

  dbs.query(selectQuery, (selectError, selectResult) => {
    if (selectError) {
      console.error("Error querying user:", selectError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (selectResult.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      const user = selectResult[0];
      const token = jwt.sign(
        { email: user.email, role: user.role, userid: user.uuid },
        "secret1234", //key
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ message: "Login successful", token, role: user.role });
      console.log("Login successful");
    }
  });
};

exports.getdata = (req, res) => {
  const selectQuery = `SELECT name,uuid FROM studtentsdata_dbs.user WHERE role != 'admin'`;

  dbs.query(selectQuery, (selectError, selectResult) => {
    if (selectError) {
      console.error("Error retrieving data:", selectError);
      res.status(500).json({ error: "data not get something error" });
      return;
    }
    res.status(200).json({ selectResult });
  });
};

exports.createdata = (req, res) => {
  const getUserEmailQuery = `SELECT email FROM studtentsdata_dbs.user WHERE uuid = '${req.body.userid}'`;

  dbs.query(getUserEmailQuery, (userError, userResult) => {
    if (userError) {
      console.error("Error fetching user email:", userError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (userResult.length === 0) {
      console.error("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userEmail = userResult[0].email;

    const mailOptions = {
      from: "hemanathan2k01@gmail.com",
      to: userEmail,
      subject: `Welcome to User`,
      html: `<div style='border:2px solid red;border-radius:10px'><h1 style='text-align:center;color:red'>Welcome</h1><p >We are welcome's you</p></div>`,
    };

    const insertuserQuery = `INSERT INTO studtentsdata_dbs.std_data (dataid,userid,dept,mobileno,dob,blood,address
      ) VALUES ('${uuid_data()}', '${req.body.userid}','${req.body.dept}','${
      req.body.mobileno
    }','${req.body.dob}','${req.body.blood}','${req.body.address}')`;

    dbs.query(insertuserQuery, (insertError, insertResult) => {
      if (insertError) {
        console.error("Error creating user:", insertError);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      console.log("user created successfully");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "hemanathan2k01@gmail.com",
          pass: "fxac nywx wzsf gyxe",
        },
      });

      transporter.sendMail(mailOptions, (emailError, emailInfo) => {
        if (emailError) {
          console.error("Error sending email:", emailError);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        console.log("Email sent:", emailInfo.response);
        res
          .status(200)
          .json({ message: "User created successfully. Email sent." });
      });
    });
  });
};

exports.selectData = (req, res) => {
  const selectQuery =
    "SELECT studtentsdata_dbs.user.name,studtentsdata_dbs.user.email, studtentsdata_dbs.std_data.dept, studtentsdata_dbs.std_data.mobileno,studtentsdata_dbs.std_data.dob,studtentsdata_dbs.std_data.blood,studtentsdata_dbs.std_data.address FROM studtentsdata_dbs.std_data LEFT JOIN  studtentsdata_dbs.user ON studtentsdata_dbs.std_data.userid = studtentsdata_dbs.user.uuid";

  dbs.query(selectQuery, (selectError, selectResult) => {
    if (selectError) {
      console.error("Error selecting data:", selectError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ data: selectResult });
  });
};

exports.profile = (req, res) => {
  console.log(req.user);

  const selectQuery = `SELECT studtentsdata_dbs.user.name,studtentsdata_dbs.user.email, studtentsdata_dbs.std_data.dept, studtentsdata_dbs.std_data.mobileno,studtentsdata_dbs.std_data.dob,studtentsdata_dbs.std_data.blood,studtentsdata_dbs.std_data.address FROM studtentsdata_dbs.std_data LEFT JOIN  studtentsdata_dbs.user ON studtentsdata_dbs.user.uuid = '${req.user.userid}'`;

  dbs.query(selectQuery, (selectError, selectResult) => {
    if (selectError) {
      // console.error("Error selecting data:", selectError);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.status(200).json({ data: selectResult });
  });
};
