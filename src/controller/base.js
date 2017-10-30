// const { getInstallSettings } = require('./install_settings');

module.exports = class extends think.Controller {
  async __before() {
    // if (this.ctx.url === '/install') {
    //   return;
    // }
    // var settings = await getInstallSettings();
    // if (!settings) {
    //   return this.redirect('/install');
    // }
  }
};
