const RestBase = require('./rest');

module.exports = class extends RestBase {
  indexAction() {
    return this.display();
  }
};
