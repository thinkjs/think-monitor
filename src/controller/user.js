// 修改密码，找回账号
const Base = require('./base');

module.exports = class extends Base {
  constructor(ctx) {
    super(ctx);
    this.userModel = this.model('user');
    this.userStatus = {
      ACCOUNT_FORBIDDEN: 2
    };
  }
  /**
   * login
   */
  async loginAction() {
    const username = this.post('username');
    const userInfo = await this.userModel.where({ username }).find();
    if (think.isEmpty(userInfo)) {
      return this.fail('用户不存在');
    }

    const { enable } = userInfo;
    if (enable === this.userStatus.ACCOUNT_FORBIDDEN) {
      return this.fail('已经被锁定');
    }

    const password = this.post('password');
    const isValidate = this.userModel.checkPassword(password, userInfo.password);
    if (!isValidate) {
      return this.fail('密码不正确');
    }
    return this.success();
  }
  /**
   * logout
   */
  async logoutAction() {
    await this.session('userInfo', '');
    return this.redirect('/');
  }
  /**
   * update password
   */
  async passwordAction() {
    return this.success();
  }
};
