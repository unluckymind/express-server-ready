const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "sahabathalosis"
});

con.connect((err) => {
  err ? err : "success"
})

module.exports = con;
