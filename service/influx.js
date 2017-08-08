const Influx = require('influx');
const dbConfig = require('./init/db-config');

const MEASUREMENT = 'perf';
const FIELDS = {
  cpu_user: Influx.FieldType.INTEGER,
  cpu_system: Influx.FieldType.INTEGER,
  rss: Influx.FieldType.INTEGER,
  heap_total: Influx.FieldType.INTEGER,
  external: Influx.FieldType.INTEGER,
  heap_used: Influx.FieldType.INTEGER,
  time_diff: Influx.FieldType.INTEGER,
  is_master: Influx.FieldType.BOOLEAN
};
const TAGS = [
  'hash', 'host', 'pid'
];

const influxs = {};

function pickValues(point, names) {
  var values = {};
  for(var name of names) {
    values[name] = point[name];
  }
  return values;
}

exports.connectInflux = function(dbName) {
  const influx = new Influx.InfluxDB({
   host: dbConfig['influxDB'].influx_host,
   database: dbName,
   schema: [
     {
       measurement: MEASUREMENT,
       fields: FIELDS,
       tags: TAGS
     }
   ]
  })
  influxs[dbName] = influx;
}

exports.write = function(points, dbName) {
  if(!points || points.length === 0) return Promise.resolve();
  var fieldNames = Object.keys(FIELDS);
  var ps = points.map(p=>{
    return {
      measurement: MEASUREMENT,
      tags: pickValues(p, TAGS),
      fields: pickValues(p, fieldNames),
      timestamp: p.timestamp
    };
   });
  points.length = 0;
  return influxs[dbName].writePoints(ps);
}


    // where time >= ${ new Date().valueOf() * 1000000 - 1000 * 1000000000}
exports.read = function({dbName, interval='', startTime = Date.now() - 86400000, endTime = Date.now() - 5000}) {
  if(!influxs[dbName])return null;
  return influxs[dbName].queryRaw(`
    select * from perf${interval}
    where time >= ${startTime * 1000000} and time <= ${endTime * 1000000}
    group by pid
    ORDER BY time ASC
  `, {precision: Influx.Precision.Milliseconds});
}

exports.readHost = function({interval='', startTime = Date.now() - 86400000, endTime = Date.now() - 5000}) {
  return influx.queryRaw(`
    select * from perf${interval}
    where time >= ${startTime * 1000000} and time <= ${endTime * 1000000}
    group by pid
    ORDER BY time ASC
  `, {precision: Influx.Precision.Milliseconds});
}
