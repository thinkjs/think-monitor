const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  async installAction() {
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
      'influx_name',
      'influx_host',
      'influx_port'
    ];
    const post = this.post(dataKeys.join(','));
    const userConf = {
      username: post.username,
      password: post.password
    };
    const mysqlConf = {
      host: post.db_host,
      port: post.db_port,
      database: post.db_name,
      user: post.db_account,
      password: post.db_password,
      prefix: post.db_table_prefix
    };
    const influxConf = {
      host: post.influx_host,
      port: post.influx_port,
      name: post.influx_name
    };
    const instance = this.service('install', mysqlConf, influxConf);
    const checkResult = await instance.checkMysql();
    if (think.isError(checkResult)) {
      return this.fail('请检查Mysql配置');
    }
    const promises = [instance.initMysql(), instance.initInflux()];
    const result = await Promise.all(promises).catch(err => {
      think.logger.error(err.message);
      return err;
    });
    if (think.isError(result)) {
      console.log(result);
      return this.fail();
    }
    // 201 Created
    this.status = 201;
    return this.success(undefined, '安装成功');
  }
};
