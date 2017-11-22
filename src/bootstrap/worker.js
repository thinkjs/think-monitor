// const Agent = require('./Agent');
const agentFn = require('./agentFn');

const options = {
  protocol: 'http',
  host: '10.16.133.122',
  port: '3001',
  pathname: 'monitor',
  capture: function() {
    const data = {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      pid: process.pid,
      prevPid: process.env.THINK_PREV_PID
    };
    return data;
  }
};

// think.agent = new Agent(options);
// agentFn(options)();
