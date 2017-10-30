module.exports = {
  /**
   * 返回安装配置文件路径
   */
  get settingPath() {
    return `${think.ROOT_PATH}\\.install_setting`;
  },
  /**
   * 判断是否已经安装
   * @returns [Boolean]
   */
  get hasInstalled() {
    return think.isFile(this.settingPath);
  }
};
