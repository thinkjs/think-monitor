// invoked in worker
const os = require('os');
const fetch = require('node-fetch');

// eslint-disable-next-line
async function postData(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

module.exports = (options) => {
  return function() {
    think.messenger.on('monitorMapEvent', options.capture);
    think.messenger.on('monitorConsumeEvent', () => {
      setInterval(async() => {
        const data = await think.messenger.map('monitorMapEvent');
        const {protocol, host, port, path} = options;
        const url = `${protocol}://${host}:${port}/${path}`;
        data.hostname = os.hostname();
        // const ret = await postData(url, data);
        think.logger.info(url, data);
      }, 3 * 1000);
    });
    think.messenger.consume('monitorConsumeEvent');
  };
};
