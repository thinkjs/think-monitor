const _ = require('ramda');
const fs = require('fs');
const path = require('path');
const influx = require('influx');
const helper = require('think-helper');

module.exports = class extends think.Service {
  constructor(mysql, influx) {
    super();
    this.mysql = mysql;
    this.influx = influx;
  }
  /**
   * 获取数据库连接实例
   * @param {Object} mysql - default is `this.mysql`
   */
  getInstance() {
    const { host, port, user, password, encoding = 'utf8' } = this.mysql;
    const modelAdapter = think.config('model');
    const mysqlConfig = helper.parseAdapterConfig(modelAdapter);
    modelAdapter.mysql = Object.assign({}, mysqlConfig, {
      host,
      port,
      user,
      password,
      encoding
    });
    think.config('model', modelAdapter);
    return this.model();
  }
  /**
   * 目标服务器是否存在该数据库
   * @param {String} database - 数据库名
   */
  async isDatabaseExist(database) {
    const modelInstance = this.getInstance();
    const databases = await modelInstance.query('show databases;');
    const databaseNameList = databases.map(database => database['Database']);
    return databaseNameList.findIndex(item => item === database) > -1;
  }
  /**
   * 检查mysql版本
   * @param {*} mysql - 数据库配置
   */
  async checkMysql() {
    const modelInstance = this.getInstance();
    const result = await modelInstance.query('select version();');

    let version;
    const matchRet = result[0]['version()'].match(/^[\d.]/);
    if (think.isArray(matchRet)) {
      version = result[0]['version()'];
    } else {
      version = result[0];
    }
    this.mysql.encoding = _.gt(version, '5.5.3') ? 'utf8mb4' : 'utf-8';
    return true;
  }
  /**
   * 将sql写入到目标数据库
   */
  async initMysql() {
    const { database } = this.mysql;
    const modelInstance = this.getInstance();
    if (!await this.isDatabaseExist(database)) {
      await modelInstance.query(`create database ${this.mysql.database};`);
    }
    await modelInstance.query(`use ${database};`);
    const sqls = fs
      .readFileSync(path.join(__dirname, 'init.sql'), 'utf8')
      .replace(/\n/g, '')
      .split(';')
      .filter(item => item !== '');
    const promises = sqls.map(sql => {
      return modelInstance.query(sql);
    });
    const result = await Promise.all(promises);
    return result;
  }
  async initInflux() {
    return true;
  }
};
