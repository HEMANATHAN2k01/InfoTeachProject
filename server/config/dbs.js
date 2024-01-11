const mysql = require("mysql");

const dbConnect = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  db: "studentsdata_dbs",
});

try {
  dbConnect.connect();
  console.log("db-Connected!");
} catch (err) {
  console.error("Connection error:", err.message);
}

module.exports = dbConnect;
