const InspectorProxy = require('inspector-proxy');
const proxy = new InspectorProxy({ port: 9999 });
const childProcess = require('child_process');

const instance = childProcess.fork('./development.js', {
  execArgv: [ '--inspect' ]
});
instance.on('message', msg => {
  if (msg.act === 'inspectPort' && msg.port) {
    proxy.start({ debugPort: msg.port });
  }
});
