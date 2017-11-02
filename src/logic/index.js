module.exports = class extends think.Logic {
  indexAction() {

  }
  installAction() {
    if (this.isGet) {
      return;
    }
    this.rules = {
      username: {
        required: true,
        method: 'post'
      },
      password: {
        required: true,
        method: 'post'
      },
      db_host: {
        required: true,
        method: 'post'
      },
      db_port: {
        required: true,
        method: 'post'
      },
      db_name: {
        required: true,
        method: 'post'
      },
      db_account: {
        required: true,
        method: 'post'
      },
      db_password: {
        required: true,
        method: 'post'
      },
      db_table_prefix: {
        required: true,
        method: 'post'
      },
      influx_host: {
        required: true,
        method: 'post'
      },
      influx_port: {
        required: true,
        method: 'post'
      }
    };
  }
};
