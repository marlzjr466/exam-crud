require('dotenv').config()
const mysql = require('mysql')

// Connect to database
const connection = mysql.createConnection({
	host: process.env.TYPEORM_HOST,
	user: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	multipleStatements: true
})

module.exports = connection