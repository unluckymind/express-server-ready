const mysql = require("mysql");

let users = ''
let passwords = ''
let databases = ''

if (process.env.NODE_ENV !== 'production') {
  users = 'root'
  passwords = ''
  databases = 'sahabathalosis'
} else {
  users = 'admin'
  passwords = 'PJYwD5uvR3sXWCG8h'
  databases = 'sahabat_db'
}

const con = mysql.createConnection({
  host: 'localhost',
  user: users,
  password: passwords,
  database: databases,
  port: '3306'
});

con.connect((err) => {
  err ? console.log(err) : console.log("database connected, current env is on " + process.env.NODE_ENV)
})

module.exports = con;
