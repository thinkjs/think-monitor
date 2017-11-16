const MysqlService = require('../service/mysql');

module.exports = class extends think.Controller {
  /**
   * before method
   */
  async __before() {
    this.ctx.checkInstalled = await MysqlService.checkInstalled();
    const { controller, action } = this.ctx;
    const whiteList = ['index/install', 'user/login'];
    const path = controller + '/' + action;
    if (~whiteList.findIndex(item => item === path)) {
      return true;
    }

    if (!this.ctx.checkInstalled) {
      return this.redirect('/index/install');
    }

    const userInfo = (await this.session('userInfo')) || {};
    if (think.isEmpty(userInfo)) {
      if (this.isAjax()) {
        return this.fail('NOT_LOGIN');
      }
    }
    this.userInfo = userInfo;
    if (!this.isAjax()) {
      this.assign('userInfo', {
        sid: userInfo.sid,
        username: userInfo.username,
        is_admin: userInfo.is_admin
      });
    }

    if (this.isGet) {
      let token = this.session('token');
      if (!token) {
        token = think.uuid('v4').slice(0, 8);
        this.assign('token', token);
      }
      this.session('token', token);
    }
    const stoken = this.session('token');
    const token = this.post('token');
    if (!token || token !== stoken) {
      return this.fail('token不匹配');
    }
  }
  /**
   * magic method
   */
  async __call() {
    if (this.isAjax()) {
      return this.fail('ACTION_NOT_FOUND');
    }
    return this.display('index_index');
  }
};
