
const fs = require('fs');
const path = require('path');
const Influx = require('influx');
const mysql = require('mysql');
const uuid = require('uuid');
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


const initInfluxDB = async ({ influx_host, influx_port, influx_name }) => {
  try {
    const influx = new Influx.InfluxDB({
      host: influx_host,
      database: influx_name,
      port: influx_port
    });
    await influx.createDatabase(influx_name);
  } catch (e) {
    console.log(e);
  }
};

module.exports = class extends think.Controller {
  async projectAction() {
    var data = this.post();
    let { influx_name } = data;
    let dbConfig = require('./db-config');
    let influxConfig = dbConfig['influxDB'];
    let { influx_host, influx_port } = influxConfig;
    initInfluxDB({ influx_host, influx_port, influx_name });
    let hash = uuid.v4();
    insertToMySQL(hash, influx_name);

    return {
      errno: 0,
      hash,
      message: 'success'
    }
  }

  async insertToMySQL(hash, name) {
    try {
      // 将这个项目插入到project表
      let projectAddSql = 'INSERT INTO monitor_project(project_id, hash, project_name) VALUES(0,?,?)';
      var projectAddSql_Params = [hash, name];
      global.db.queryAsync(projectAddSql, projectAddSql_Params);

      // 取出所有管理员
      let admins = await global.db.queryAsync('SELECT `user_id` FROM `monitor_user` WHERE `permisson_level`="1"');
      let project = await global.db.queryAsync('SELECT `project_id` FROM `monitor_project` WHERE `hash`="' + hash + '"');
      // 将每个管理员和这个project的对应关系插入到up表。
      admins.forEach((item) => {
        let upAddSql = 'INSERT INTO user_project(up_id, user_id, project_id) VALUES(0,?,?)';
        let upAddSql_Params = [item.user_id, project[0].project_id];
        global.db.queryAsync(upAddSql, upAddSql_Params);
      })
    } catch (e) {
      console.log(e);
    }
  }
}
