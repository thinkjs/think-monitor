const Influx = require('influx');

module.exports = class extends think.Service {
  static get getMeasurement() {
    return {
      cpu_user: Influx.FieldType.INTEGER,
      cpu_system: Influx.FieldType.INTEGER,
      rss: Influx.FieldType.INTEGER,
      heap_total: Influx.FieldType.INTEGER,
      external: Influx.FieldType.INTEGER,
      heap_used: Influx.FieldType.INTEGER,
      time_diff: Influx.FieldType.INTEGER,
      is_master: Influx.FieldType.BOOLEAN
    };
  }
  static get getTags() {
    return ['hash', 'host', 'tag'];
  }
  static async initInflux(influxConf) {
    const influx = new Influx.InfluxDB(influxConf);
    const result = await influx.createDatabase(influx.database);
    return result;
  }
};
