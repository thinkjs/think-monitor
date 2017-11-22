const fs = require('fs');
const readFile = think.promisify(fs.readFile, fs);
const writeFile = think.promisify(fs.writeFile, fs);
const installedFile = think.ROOT_PATH + think.sep + '.installSettings';

module.exports = {
  async getInstallSettings() {
    if (think.installSettings) {
      return think.installSettings;
    }
    try {
      if (think.installSettings === false) {
        return null;
      }
      const content = await readFile(installedFile);
      var settings = JSON.parse(content);
      think.installSettings = settings;
      return settings;
    } catch (e) {
      think.installSettings = false;
    }
    return null;
  },
  async setInstallSettings(settings) {
    await writeFile(installedFile, JSON.stringify(settings));
  }
};
