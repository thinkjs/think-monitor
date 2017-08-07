const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const Influx = require('influx');

const MEASUREMENT = 'perf';
const FIELDS = {
  cpu_user: Influx.FieldType.INTEGER,
  cpu_system: Influx.FieldType.INTEGER,
  rss: Influx.FieldType.INTEGER,
  heap_total: Influx.FieldType.INTEGER,
  external: Influx.FieldType.INTEGER,
  heap_used: Influx.FieldType.INTEGER,
  time_diff: Influx.FieldType.INTEGER,
  is_master: Influx.FieldType.BOOLEAN
};
const TAGS = [
  'hash', 'host', 'pid'
];


const updateConfig = (data) => {
	let content = `
		module.exports =
		{
			mysql: {
		    host: ${data.mysql_host},
		    port: ${data.mysql_port},
		    user: ${data.mysql_user},
		    password: ${data.mysql_password},
		    database: ${data.mysql_database},
			},
			influxDB: {
				host: ${data.influx_host},
		    port: ${data.influx_port},
		    database: ${data.influx_database},	
			}
		};
	`
  let srcPath = path.resolve('./service/init');
  fs.statSync(srcPath);
  let dbConfigFile = path.join(srcPath, 'db-config.js');
  fs.writeFileSync(dbConfigFile, content);
};


const initMySQL = async ({mysql_user, mysql_host, mysql_password, mysql_port, mysql_database}) => {

	let connection = mysql.createConnection({
	  host     : mysql_host,
	  user     : mysql_user,
	  password : mysql_password,
	  port     : mysql_port
	});

	connection.connect();

	await connection.query("CREATE DATABASE `" + mysql_database + "`");
	await connection.query("USE `" + mysql_database + "`");

	let mysqlFile = path.join(path.resolve('./service/init'), 'mysql-script.sql');
	let content = fs.readFileSync(mysqlFile, 'utf8');
	
	content = content.split(';');
	try{
    for(let item of content) {
      item = item.trim();
      if(item) {
        await connection.query(item);
      }
    }
  }catch(e) {
    console.log(e);
  }
};

const initInfluxDB = async ({influx_host, influx_port, influx_database}) => {
	const influx = new Influx.InfluxDB({
	  host: influx_host,
	  database: influx_database,
	  port: influx_port
	});
	await influx.createDatabase(influx_database);
	await influx.writeMeasurement(MEASUREMENT, [
			{
				tags: TAGS,
    		fields: FIELDS,
			}
		])
};



exports.init = async function(data){
  let {mysql_user, mysql_host, mysql_password, mysql_port, mysql_database, influx_host, influx_port, influx_database} = data;

	updateConfig(data);

	initMySQL({mysql_user, mysql_host, mysql_password, mysql_port, mysql_database});
	initInfluxDB({influx_host, influx_port, influx_database});

}