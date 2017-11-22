const installed = Symbol('installed');
module.exports = {
  /**
   * 返回安装配置文件路径
   */
  get settingPath() {
    return `${think.ROOT_PATH}\\.install_setting`;
  },
  /**
   * 系统是否已经安装
   * @returns [Boolean]
   */
  [installed]: false,
  get checkInstalled() {
    return this[installed];
  },
  set checkInstalled(status) {
    this[installed] = status;
  }
};
