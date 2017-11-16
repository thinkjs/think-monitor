module.exports = class extends think.Model {
  /**
   * 获取用户信息
   */
  async getUserInfo(where) {
    const userInfo = await this.where(where)
      .find()
      .catch(() => false);
    return userInfo;
  }
};
