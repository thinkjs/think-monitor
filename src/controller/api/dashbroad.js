const Base = require('./base');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
};
