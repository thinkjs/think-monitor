module.exports = class extends think.Model {
  /**
   * checkPassword
   */
  checkPassword(password, hashPassword) {
    // 以后再改为hash
    return password === hashPassword;
  }
};
