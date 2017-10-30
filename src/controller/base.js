module.exports = class extends think.Controller {
  async __before() {
    // 判断系统是否安装
    const hasInstalled = this.ctx.hasInstalled;
    if (!hasInstalled) {
      return this.redirect('/install');
    }
    if (hasInstalled && this.ctx.url === '/install') {
      return this.redirect('/console');
    }
  }
};
