const mysql = require("mysql");

let users = ''
let passwords = ''
let databases = 'sahabat_db'
let hosts = ''

if (process.env.NODE_ENV !== 'production') {
  users = 'root'
  hosts = 'localhost'
  passwords = ''
} else {
  users = 'admin'
  hosts = '35.197.148.245'
  passwords = 'PJYwD5uvR3sXWCG8h'
}

const con = mysql.createConnection({
  host: hosts,
  user: users,
  password: passwords,
  database: databases,
  port: '3306'
});

con.connect((err) => {
  err ? console.log(err) : console.log("database connected, current env is on " + process.env.NODE_ENV)
})

module.exports = con;
