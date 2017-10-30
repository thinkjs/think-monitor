const Base = require('../base.js');

module.exports = class extends Base {
  postAction() {
    return this.success();
  }
  __call() {
    return this.display('install');
  }
};
