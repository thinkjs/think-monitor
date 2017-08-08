const fs = require('fs');
const path = require('path');
const Influx = require('influx');
const mysql = require('mysql');
const dbConfig = require('./db-config');
const uuid = require('uuid');
const Bluebird = require('bluebird');
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

let mysqlConfig = dbConfig['mysql'];
let {host, user, password, port, database} = mysqlConfig;
let connection = mysql.createConnection({
  host,
  user,
  password,
  port,
  database
});
connection.connect();
global.db = Bluebird.promisifyAll(connection);

const initInfluxDB = async ({influx_host, influx_port, influx_name}) => {
	try {
		const influx = new Influx.InfluxDB({
		  host: influx_host,
		  database: influx_name,
		  port: influx_port
		});
		await influx.createDatabase(influx_name);
	}catch(e) {
		console.log(e);
	}
};

const insertMySQL = async (hash, name) => {
	try {
		let projectAddSql = 'INSERT INTO monitor_project(id, hash, name) VALUES(0,?,?)';
		var projectAddSql_Params = [hash, name];
		await connection.query(projectAddSql, projectAddSql_Params);
	}catch(e) {
		console.log(e);
	}
}

exports.initProject = function(data){
  let {influx_name} = data;
  let influxConfig = dbConfig['influxDB'];
  let {influx_host, influx_port} = influxConfig;
	initInfluxDB({influx_host, influx_port, influx_name});
	let hash = uuid.v4();
	insertMySQL(hash, influx_name);

	return {
		errno: 0,
		hash,
		message: 'success'
	}
}