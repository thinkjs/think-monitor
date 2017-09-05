
const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const bluebird = require('bluebird');
const { setInstallSettings, getInstallSettings } = require('../install_settings');

module.exports = class extends think.Controller {
  async indexAction() {
    var data = this.ctx.post();
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
    await setInstallSettings(config);
    await this.initMySQL(data);
  }

  async initMySQL({ mysql_user, mysql_host, mysql_password, mysql_port, mysql_database, user_account, user_password }) {
    try {
      let connection = mysql.createConnection({
        host: mysql_host,
        user: mysql_user,
        password: mysql_password,
        port: mysql_port
      });

      connection.connect();
      connection = bluebird.promisifyAll(connection);
      await connection.queryAsync("CREATE DATABASE `" + mysql_database + "`");
      await connection.queryAsync("USE `" + mysql_database + "`");
      let content = fs.readFileSync(path.join(think.ROOT_PATH, 'mysql.sql'), 'utf8');

      content = content.split(';');
      for (let item of content) {
        item = item.trim();
        if (item) {
          await connection.queryAsync(item);
        }
      }
      let userAddSql = 'INSERT INTO user(id, username, password, permisson_level) VALUES(0,?,?,?)';
      let userAddSql_Params = [user_account, user_password, true];
      await connection.queryAsync(userAddSql, userAddSql_Params);
    } catch (e) {
      console.log(e);
    }
  }
};