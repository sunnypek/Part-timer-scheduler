//you need to install npm install mysql2
const mysql = require('mysql2');

// import the module into mysql and created the connection
// Note that to access this database you would need to be inside NTU network or NTUVPN

module.exports = mysql.createConnection( { 

host:'172.21.148.170',
port: 3306,
user:'UBHRS_User',
password:'CZ3002B3UBHRS',
database: 'ubhrs_db',
});  