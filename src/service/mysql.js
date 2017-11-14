const fs = require('fs');
const _ = require('ramda');
const path = require('path');
const helper = require('think-helper');

module.exports = class extends think.Service {
  /**
   * 设置数据库适配器
   * @param {Object} mysql - 数据库配置
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
   * @param {Object} mysql - 数据库配置
   */
  static getInstance(mysql) {
    const { host, port, user, password, encoding = 'utf8' } = mysql;
    this.setModelAdapter({ host, port, user, password, encoding });
    return think.model();
  }
  /**
   * 目标服务器是否存在该数据库
   * @param {Object} mysql - 数据库配置
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
   * @param {Object} mysql - 数据库配置
   */
  static async getEncoding(mysql) {
    const modelInstance = this.getInstance(mysql);
    const result = await modelInstance.query('select version();').catch(() => false);
    if (!result) {
      const err = new Error('数据库信息有误');
      return Promise.reject(err);
    }
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
   * @param {Object} - 数据库配置
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
    const dbFilePath = path.join(think.ROOT_PATH, 'monitor.sql');
    if (!think.isFile(dbFilePath)) {
      const err = new Error('数据库文件（monitor.sql）不存在，请重新下载');
      return Promise.reject(err);
    }
    let content = fs.readFileSync(dbFilePath, 'utf8');
    content = content
      .split('\n')
      .filter(item => {
        item = item.trim();
        const ignore = ['#', 'LOCK', 'UNLOCK'];
        for (const it of ignore) {
          if (item.indexOf(it) === 0) {
            return false;
          }
        }
        return true;
      })
      .join(' ');
    content = content
      .replace(/\/\*.*?\*\//g, '')
      .replace(/fk_/g, prefix || '')
      .split(';');
    const promises = [];
    for (let item of content) {
      item = item.trim();
      if (item) {
        promises.push(modelInstance.query(item));
      }
    }
    const result = await Promise.all(promises).catch(() => false);
    if (!result) {
      const err = new Error('数据表导入失败，请在控制台下查看具体的错误信息，并在 GitHub 上发 issue。');
      return Promise.reject(err);
    }
    return result;
  }
  /**
   * 检查系统是否安装
   */
  static async checkInstalled() {
    const settingPath = path.join(think.ROOT_PATH, '.install_setting');
    if (!think.isFile(settingPath)) {
      return false;
    }
    const installSetting = fs.readFileSync(settingPath);
    const tables = ['user', 'permission']; // permisson
    const { mysql } = JSON.parse(installSetting);
    const modelInstance = this.getInstance(mysql);
    const tableSet = await modelInstance
      .query(
        "SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA`='" +
          mysql.database +
          "'"
      )
      .catch(() => false);
    if (think.isEmpty(tableSet)) {
      return false;
    }
    const existTables = tableSet.map(table => table.TABLE_NAME);
    const installed = tables.every(
      table => existTables.findIndex(item => item === mysql.prefix + table) > -1
    );
    return installed;
  }
};
