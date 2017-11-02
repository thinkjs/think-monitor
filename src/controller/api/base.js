const Base = require('../base');

module.exports = class extends Base {
  __call() {
    return this.display('console');
  }
};
