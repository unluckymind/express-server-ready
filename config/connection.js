const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sahabathalosis"
});

con.connect((err) => {
  err ? err : "success"
})

module.exports = con;
