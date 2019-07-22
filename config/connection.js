const mysql = require("mysql");

let users = ''
let passwords = ''
let databases = ''

if (process.env.NODE_ENV !== 'production') {
  users = 'root'
  passwords = ''
  database = 'sahabathalosis'
} else {
  users = ''
  passwords = ''
  database = 'sahabat_db'
}

const con = mysql.createConnection({
  host: "localhost",
  user: users,
  password: passwords,
  database: databases
});

con.connect((err) => {
  err ? console.log(err) : console.log("database connected, current env is on " + process.env.NODE_ENV)
})

module.exports = con;
