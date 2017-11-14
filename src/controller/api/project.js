const RestBase = require('./rest');

module.exports = class extends RestBase {
  getAction() {
    return this.success();
  }
  postAction() {
    // const influxService = this.service('influx', influxConf);
    // const influxResult = await influxService.initInflux().catch(err => {
    //   think.logger.error(err.message);
    //   return err;
    // });
    // if (think.isError(influxResult)) {
    //   return this.fail(influxResult.message);
    // }
    return this.success();
  }
};
