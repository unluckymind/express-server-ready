const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "halosis"
});

// con.connect(function(err) {
//   if (err) throw err;
// });

con.connect((err) => {
  err ? err : "success"
})

module.exports = con;
