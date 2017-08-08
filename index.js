const express = require('express')
const bodyParser = require('body-parser');
const influx = require('./service/influx');
const init = require('./service/init/init');
const initProject = require('./service/init/init-project');
const schedule = require('node-schedule');
const cors = require('cors');
const path = require('path');
const app = express();

const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const registerApps = {
  //'7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e': {id: 1, points: []}
}

app.post('/add', async function (req, res) {
  var body = req.body;
  var {hash, host, pid, is_master, points} = body;
  if(!registerApps.hasOwnProperty(body.hash)) {
    let data = await global.db.queryAsync('SELECT * FROM `monitor_project` WHERE `hash`="'+hash+'"');
    influx.connectInflux(data[0].name);
    registerApps[body.hash] = {id: data[0].id, dbName: data[0].name, points: []};
  }
  var registerApp = registerApps[body.hash];
  if(!registerApp) return res.sendStatus(401);
  var hash = registerApp.id;
  points.forEach(point=>{
    point.hash = hash;
    point.host = host;
    point.pid = pid;
    point.is_master = is_master;
  });
  registerApp.points.push.apply(registerApp.points, points);
  res.sendStatus(200);
})

app.get("/process", cors(), async function(req, res) {
  let data = await global.db.queryAsync('SELECT `name` FROM `monitor_project` WHERE `hash`="'+req.query.hash+'"')
  req.query.dbName = data[0].name;
  let result = await influx.read(req.query);
  res.send(result);
});

app.get("/host", cors(), function(req, res) {
  influx.readHost(req.query).then(data=>{
    res.send(data);
  });
});

app.post("/init", cors(), function(req, res) {
  res.send(init.init(req.body));
});

app.post("/initProject", cors(), function(req, res) {
  res.send(initProject.initProject(req.body));
});

app.get("/projectList", cors(), async function(req, res) {
  let data = await global.db.queryAsync(`SELECT * FROM monitor_project`)
  res.send(result);
});

app.get(/^\/monitor(\/?).*$/, cors(), function(req, res) {
  res.sendFile( path.join(__dirname, 'web/monitor.html') );
});
app.get(/^\/install(\/?).*$/, cors(), function(req, res) {
  res.sendFile( path.join(__dirname, 'web/install.html') );
});


app.get(/^(.+)$/, function(req, res){
   console.log('static file request : ' + req.params);
   res.sendFile( __dirname + req.params[0]);
});

app.listen(port, function () {
  setInterval(function(){
    Object.keys(registerApps).forEach(appKey=>{
      var app = registerApps[appKey];
      influx.write(app.points, app.dbName);
    });
  }, 5000)
  console.log(`Example app listening on port ${port}!`)
})

