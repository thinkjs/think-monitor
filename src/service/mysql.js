const fs = require('fs');
const _ = require('ramda');
const path = require('path');
const helper = require('think-helper');

module.exports = class extends think.Service {
  /**
   * 设置数据库适配器
   * @param {*} mysql - 数据库配置
   */
  static setModelAdapter(mysql) {
    const modelAdapter = think.config('model');
    const mysqlConfig = helper.parseAdapterConfig(modelAdapter);
    modelAdapter.mysql = Object.assign({}, mysqlConfig, mysql);
    think.config('model', modelAdapter);
    return true;
  }
  /**
   * 获取数据库连接实例
   * @param {Object} mysql - default is `this.mysql`
   */
  static getInstance(mysql) {
    const { host, port, user, password, encoding = 'utf8' } = mysql;
    this.setModelAdapter({ host, port, user, password, encoding });
    return think.model();
  }
  /**
   * 目标服务器是否存在该数据库
   * @param {String} database - 数据库名
   */
  static async isDatabaseExist(mysql) {
    const { database } = mysql;
    const modelInstance = this.getInstance(mysql);
    const databases = await modelInstance.query('show databases;');
    const databaseNameList = databases.map(database => database['Database']);
    return databaseNameList.findIndex(item => item === database) > -1;
  }
  /**
   * 获取目标服务器数据库应该设置的字符集
   * @param {*} mysql - 数据库配置
   */
  static async getEncoding(mysql) {
    const modelInstance = this.getInstance(mysql);
    const result = await modelInstance.query('select version();');

    let version;
    const matchRet = result[0]['version()'].match(/^[\d.]/);
    if (think.isArray(matchRet)) {
      version = result[0]['version()'];
    } else {
      version = result[0];
    }
    return _.gt(version, '5.5.3') ? 'utf8mb4' : 'utf-8';
  }
  /**
   * 将sql写入到目标数据库
   */
  static async initMysql(mysql) {
    const { database, prefix } = mysql;
    const modelInstance = this.getInstance(mysql);
    if (await this.isDatabaseExist(mysql)) {
      const err = new Error('存在此数据库');
      return Promise.reject(err);
    }
    await modelInstance.query(`create database ${database};`);
    await modelInstance.query(`use ${database};`);
    // 创建时如何加上前缀？？
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
};
