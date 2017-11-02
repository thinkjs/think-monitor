module.exports = class extends think.Controller {
  async __before() {
    if (this.ctx.action === 'install') {
      return;
    }
    const hasInstalled = this.ctx.hasInstalled;
    if (!hasInstalled) {
      return this.redirect('/index/install');
    }
  }
};
