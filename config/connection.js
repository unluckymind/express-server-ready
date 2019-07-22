const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sahabat_db"
});

con.connect((err) => {
  err ? console.log(err) : console.log("success")
})

module.exports = con;
