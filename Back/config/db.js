const mysql = require('mysql')
const db = mysql.createConnection({
    host: "10.10.135.100",
    user: "adm",
    password: "",
    database:"dmei_sys" 
})

module.exports = db;