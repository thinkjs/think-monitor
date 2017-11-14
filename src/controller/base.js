const MysqlService = require('../service/mysql');

module.exports = class extends think.Controller {
  async __before() {
    if (this.ctx.action === 'install') {
      this.ctx.checkInstalled = await MysqlService.checkInstalled();
      return;
    }
    if (!this.ctx.checkInstalled) {
      return this.redirect('/index/install');
    }
  }
};
