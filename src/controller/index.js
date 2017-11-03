const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  async installAction() {
    const instance = this.service('install', this.ip);
    if (this.isGet) {
      if (this.ctx.hasInstalled) {
        return this.redirect('/');
      }
      return this.display();
    }

    if (this.ctx.hasInstalled) {
      // 208 aready reported
      this.status = 208;
      return this.fail('system hasInstalled');
    }

    const dataKeys = [
      'username',
      'password',
      'db_host',
      'db_port',
      'db_name',
      'db_account',
      'db_password',
      'db_table_prefix',
      'influx_host',
      'influx_port'
    ];
    const post = this.post(dataKeys.join(','));
    const userInfo = {
      username: post.username,
      password: post.password
    };
    const mysqlInfo = {
      host: post.db_host,
      port: post.db_port,
      user: post.db_account,
      password: post.db_password,
      prefix: post.db_table_prefix
    };
    const influxInfo = {
      host: post.influx_host,
      port: post.influx_port
    };
    const checkMysql = await instance.checkMysql(mysqlInfo).catch(err => err);
    if (think.isError(checkMysql)) {
      return this.fail('请检查Mysql配置');
    }
    const checkInflux = await instance.checkInflux(influxInfo).catch(err => err);
    if (think.isError(checkInflux)) {
      return this.fail('请检查Influx配置');
    }
    const promises = [
      instance.saveUser(userInfo),
      instance.saveMysql(mysqlInfo),
      instance.saveInflux(influxInfo)
    ];
    const result = await Promise.all(promises).catch(err => err);
    if (think.isError(result)) {
      this.fail('安装失败');
    }
    // 201 Created
    this.status = 201;
    return this.success(undefined, '安装成功');
  }
};
