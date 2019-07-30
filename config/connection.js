const mysql = require('mysql'), Message = require('../helpers/messages')

let users = '', passwords = '', databases = 'sahabat_db', hosts = '';

if (process.env.NODE_ENV !== 'production') {
  users = 'root'
  hosts = 'localhost'
  passwords = ''
} else {
  users = 'admin'
  hosts = 'localhost'
  //hosts = '35.197.148.245' database live
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
  err ? console.log(err) : console.log(Message.DB_CONNECT + ' ' + process.env.NODE_ENV)
})

module.exports = con;
