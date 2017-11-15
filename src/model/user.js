module.exports = class extends think.Model {
  /**
   * 获取用户信息
   */
  getUserInfo(where) {
    return this.where(where).find();
  }
};
