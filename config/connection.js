const mysql = require("mysql");

let users = ''
let passwords = 'PJYwD5uvR3sXWCG8h'
let databases = ''
let hosts = 'localhost'
let ports = '3306'

if (process.env.NODE_ENV !== 'production') {
  users = 'root'
  passwords = ''
  database = 'sahabathalosis'
} else {
  users = 'admin'
  passwords = 'PJYwD5uvR3sXWCG8h'
  database = 'sahabat_db'
}

const con = mysql.createConnection({
  host: hosts,
  user: users,
  password: passwords,
  database: databases,
  port: ports
});

console.log('user:' + users);

con.connect((err) => {
  err ? console.log(err) : console.log("database connected, current env is on " + process.env.NODE_ENV)
})

module.exports = con;
