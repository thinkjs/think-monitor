import RBAuthRoute from 'components/auth-route';

export default RBAuthRoute({
  path: '/init',
  chunkLoader(cb) {
    cb(
      require('./home')
    );
  }
});