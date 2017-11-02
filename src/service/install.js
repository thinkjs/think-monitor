const _ = require('ramda');
const helper = require('think-helper');

module.exports = class extends think.Service {
  constructor(ip) {
    super();
    this.ip = ip;
  }
  async checkMysql(mysql) {
    const defaultMysql = helper.parseAdapterConfig(think.config('model'));
    this.mysql = Object.assign({}, defaultMysql, mysql);

    // 设置数据库配置
    const modelConfig = think.config('model');
    modelConfig.mysql = this.mysql;
    think.config('model', modelConfig);

    // 获取数据库版本，低于5.5.3使用utf-8编码
    const modelInstance = this.model();
    const resultSet = await modelInstance.query('select version();').catch(err => err);
    if (think.isError(resultSet)) {
      resultSet.type = 'mysql';
      return Promise.reject(resultSet);
    }
    let version;
    const matchRet = resultSet[0]['version()'].match(/^[\d.]/);
    if (think.isArray(matchRet)) {
      version = resultSet[0]['version()'];
    } else {
      version = resultSet[0];
    }
    this.mysql.encoding = _.gt(version, '5.5.3') ? 'utf8mb4' : 'utf-8';
    return true;
  }
  async checkInflux(influx) {
    // 10.16.133.122 49364
    this.influx = influx;
    return true;
  }
  async saveUser(userInfo) {
    return true;
  }
  async saveMysql(mysqlInfo) {
    return true;
  }
  async saveInflux(influxInfo) {
    return true;
  }
};
