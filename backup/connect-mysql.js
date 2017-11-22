const Bluebird = require('bluebird');
const mysql = require('mysql');

let db;
if(global.db) {
	db = global.db;
}else {
	let dbConfig = require('./init/db-config');
	let mysqlConfig = dbConfig['mysql'];
	let {host, port, user, password, database} = mysqlConfig
	let connection = mysql.createConnection({
	  host,
	  user,
	  password,
	  port,
	  database
	});
	connection.connect();
	db = Bluebird.promisifyAll(connection);
}

exports.db = db;