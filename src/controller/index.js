const fs = require('fs');
const path = require('path');
const util = require('util');
const Base = require('./base.js');
const MysqlService = require('../service/mysql');
const writeFile = util.promisify(fs.writeFile);

module.exports = class extends Base {
  /**
   * 首页
   */
  indexAction() {
    return this.display();
  }
  /**
   * 登录
   */
  async loginAction() {
    return this.success();
  }
  /**
   * 登出
   */
  async logoutAction() {
    await this.session('sid', null);
    return this.redirect('/');
  }
  /**
   * 安装
   */
  async installAction() {
    if (this.isGet) {
      if (this.ctx.checkInstalled) {
        return this.redirect('/');
      }
      return this.display();
    }
    if (this.ctx.checkInstalled) {
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
      database: post.influx_name
    };
    // 根据数据库版本设置字符集
    const encoding = await MysqlService.getEncoding(mysqlConf);
    if (think.isError(encoding)) {
      return this.fail('请检查Mysql配置');
    }
    mysqlConf.encoding = encoding;
    // 安装数据库
    const mysqlResult = await MysqlService.initMysql(mysqlConf).catch(err => {
      think.logger.error(err.message);
      return err;
    });
    if (think.isError(mysqlResult)) {
      return this.fail(mysqlResult.message);
    }
    // 将用户添加到用户表中，并给予权限
    MysqlService.setModelAdapter(mysqlConf);
    const userModel = this.model('user');
    const datetime = think.datetime(new Date());
    const adminInfo = Object.assign({}, userConf, {
      is_admin: 3,
      create_time: datetime,
      last_login: datetime,
      login_ip: this.ctx.ip,
      enable: 1
    });
    await userModel.add(adminInfo);
    // 将配置保存到文件中
    const installSetting = { mysql: mysqlConf, influx: influxConf };
    await writeFile(path.join(think.ROOT_PATH, '.install_setting'), JSON.stringify(installSetting));
    // 201 Created
    this.status = 201;
    return this.success(undefined, '安装成功');
  }
};
