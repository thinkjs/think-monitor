const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const Bluebird = require('bluebird');

exports.updateConfig = function(data){
	let config = {
			mysql: {
		    host: data.mysql_host,
		    port: data.mysql_port,
		    user: data.mysql_user,
		    password: data.mysql_password,
		    database: data.mysql_database,
			},
			influxDB: {
				influx_host: data.influx_host,
		    influx_port: data.influx_port,
			}
	}
	let content = `
		module.exports = ${JSON.stringify(config)};
	`;
  let srcPath = path.resolve('./service/init');
  fs.statSync(srcPath);
  let dbConfigFile = path.join(srcPath, 'db-config.js');
  fs.writeFileSync(dbConfigFile, content);
};


exports.initMySQL = async function({mysql_user, mysql_host, mysql_password, mysql_port, mysql_database, user_account, user_password}) {
	try{
		let connection = mysql.createConnection({
		  host     : mysql_host,
		  user     : mysql_user,
		  password : mysql_password,
		  port     : mysql_port
		});

		connection.connect();
		connection = Bluebird.promisifyAll(connection);
		await connection.queryAsync("CREATE DATABASE `" + mysql_database + "`");
		await connection.queryAsync("USE `" + mysql_database + "`");

		let mysqlFile = path.join(path.resolve('./service/init'), 'mysql-script.sql');
		let content = fs.readFileSync(mysqlFile, 'utf8');
		
		content = content.split(';');
	  for(let item of content) {
	    item = item.trim();
	    if(item) {
	      await connection.queryAsync(item);
	    }
	  }
		let userAddSql = 'INSERT INTO monitor_user(user_id, username, password, permisson_level) VALUES(0,?,?,?)';
		let userAddSql_Params = [user_account, user_password, true];
		await connection.queryAsync(userAddSql, userAddSql_Params);
	}catch(e) {
		console.log(e);
	}
};