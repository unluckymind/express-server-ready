const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "PJYwD5uvR3sXWCG8h",
  database: "sahabat_db"
});

con.connect((err) => {
  err ? err : "success"
})

module.exports = con;
