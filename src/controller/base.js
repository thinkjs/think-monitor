const MysqlService = require('../service/mysql');

module.exports = class extends think.Controller {
  async __before() {
    this.ctx.checkInstalled = await MysqlService.checkInstalled();
    if (this.ctx.action === 'install') {
      return;
    }
    if (!this.ctx.checkInstalled) {
      return this.redirect('/index/install');
    }
    const userInfo = await this.getUserInfo();
    if (!think.isEmpty(userInfo)) {
      this.userInfo = userInfo;
      this.assign('userInfo', {
        username: userInfo.username,
        email: userInfo.email,
        is_admin: userInfo.is_admin,
        enable: userInfo.enable
      });
    }
    if (this.isGet) {
      let token = await this.session('token');
      if (!token) {
        token = think.uuid().slice(0, 8);
        await this.session('token', token);
      }
      this.assign('token', token);
    } else {
      const stoken = await this.session('token');
      const token = this.post('token');
      if (!token || token !== stoken) {
        return this.fail(1000, 'token 不匹配');
      }
    }
  }
  /**
   * 获取用户信息
   */
  async getUserInfo() {
    const userModel = this.model('user');
    const sid = await this.session('sid');
    if (sid) {
      const userInfo = await userModel.getUserInfo({ sid });
      if (!think.isEmpty(userInfo)) return userInfo;
    }
    return {};
  }
  /**
   * 登录页面
   */
  toLogin() {
    return this.display();
  }
};
