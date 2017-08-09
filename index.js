const express = require('express')
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const cors = require('cors');
const path = require('path');
const os = require('os');
const fs = require('fs');

const Bluebird = require('bluebird');
const init = Bluebird.promisifyAll(require('./service/init/init'));
const influx = require('./service/influx');
const initProject = require('./service/init/init-project');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const registerApps = {};

const isInit = ()=>{
  return !fs.existsSync(path.join(__dirname, '/service/init/db-config.js'));
}

app.post('/add', async function (req, res) {
  var body = req.body;
  var {hash, host, pid, is_master, points} = body;
  if(!registerApps.hasOwnProperty(body.hash)) {
    let data = await global.db.queryAsync('SELECT * FROM `monitor_project` WHERE `hash`="'+hash+'"');
    influx.connectInflux(data[0].project_name);
    registerApps[body.hash] = {id: data[0].project_id, dbName: data[0].project_name, points: []};
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
  let data = await global.db.queryAsync('SELECT `project_name` FROM `monitor_project` WHERE `hash`="'+req.query.hash+'"')
  req.query.dbName = data[0].project_name;
  let result = await influx.read(req.query);
  res.send(result);
});

app.get("/host", cors(), function(req, res) {
  influx.readHost(req.query).then(data=>{
    res.send(data);
  });
});

app.post("/init", cors(), async function(req, res) {
  await init.updateConfig(req.body);
  init.initMySQL(req.body);
  res.send({errno: 0})
});

app.post("/addProject", cors(), function(req, res) {
  res.send(initProject.initProject(req.body));
});

app.get("/projectList", cors(), async function(req, res) {
  try{
    global.db = require('./service/connect-mysql').db;
    let projects = await global.db.queryAsync(`SELECT * FROM monitor_project`);
    let data = {
      projects,
      hostname: os.hostname(),
      port
    };
    res.send(data);
  }catch(e) {
    console.log(e);
  }
});

app.get("/userList", cors(), async function(req, res) {
  let users = await global.db.queryAsync(`SELECT * FROM monitor_user`);
  let projects = await global.db.queryAsync(`SELECT * FROM monitor_project`);
  let userProject = await global.db.queryAsync(`SELECT * FROM user_project`);
  
  let projectMap = {};
  projects.forEach(project=>{
    projectMap[project.project_id] = project.project_name;
  })
  users.forEach(user=>{
    delete user.password;
    user.project = [];
  });
  userProject.forEach(up=>{
    users.forEach(user=>{
      if(user.user_id == up.user_id){
        user.project.push(projectMap[up.project_id]);
      }
    })
  })
  res.send(users);
});

app.post("/addUser", cors(), async function(req, res) {
  let userAddSql = 'INSERT INTO monitor_user(user_id, username, password, permisson_level) VALUES(0,?,?,?)';
  let {username, password, isAdmin} = req.body;
  isAdmin = isAdmin == 'true';
  let userAddSql_Params = [username, password, isAdmin];
  await global.db.queryAsync(userAddSql, userAddSql_Params);
  let user = await global.db.queryAsync('SELECT `user_id` FROM `monitor_user` WHERE `username`="'+ username +'"');
  if(isAdmin) {
    // 取出所有项目
    let projects = await global.db.queryAsync('SELECT `project_id` FROM `monitor_project`');
    projects.forEach((item)=>{
      let upAddSql = 'INSERT INTO user_project(up_id, user_id, project_id) VALUES(0,?,?)';
      let upAddSql_Params = [user[0].user_id, item.project_id];      
      global.db.queryAsync(upAddSql, upAddSql_Params);
    })
  }
  res.send({errno: 0});
});

app.use(/^\/monitor(\/?).*$/, cors(), function(req, res) {
  isInit() ? res.redirect('/init') : res.sendFile(path.join(__dirname, 'web/monitor.html'));
});

app.use(/^\/init(\/?).*$/, cors(), function(req, res) {
  isInit() ? res.sendFile(path.join(__dirname, 'web/init.html')) : res.redirect('/monitor');
});

app.use(/^(.+)$/, function(req, res){
  //console.log('static file request : ' + req.params);
  res.sendFile( __dirname + req.params[0]);
  //isInit() ? res.sendFile( __dirname + '/web/build/init.js') : res.sendFile( __dirname + '/web/build/monitor.js');
});

const server = app.listen(port, function () {
  setInterval(function(){
    Object.keys(registerApps).forEach(appKey=>{
      var app = registerApps[appKey];
      influx.write(app.points, app.dbName);
    });
  }, 5000)
  console.log(`Example app listening on port ${port}!`)
})

