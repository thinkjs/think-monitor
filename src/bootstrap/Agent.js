const os = require('os');
const fetch = require('node-fetch');

const timer = Symbol('timer');

const defaultOptions = {
  delay: 3 * 1000,
  capture() {
    const data = {
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      pid: process.pid,
      prevPid: process.env.THINK_PREV_PID
    };
    return data;
  }
};

module.exports = class {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
    this[timer] = null;
    this.start();
  }
  start() {
    if (this[timer]) return;

    const {protocol, host, port, pathname, delay, capture} = this.options;
    // eslint-disable-next-line
    const url = `${protocol}://${host}:${port}/${pathname}`;

    think.messenger.on('monitorMapEvent', capture);
    think.messenger.on('monitorConsumeEvent', () => {
      this[timer] = setInterval(async() => {
        const data = await think.messenger.map('monitorMapEvent');
        data.hostname = os.hostname();
        // const ret = await this.postData(url, data);
        think.logger.info(data);
      }, delay);
    });
    think.messenger.consume('monitorConsumeEvent');
  }
  stop() {
    clearInterval(this[timer]);
    this[timer] = null;
  }
  postData(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
};
