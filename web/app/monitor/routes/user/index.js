import RBAuthRoute from 'components/auth-route';

export default RBAuthRoute({
  path: '/user',
  chunkLoader(cb) {
    cb(
      require('./home')
    );
  }
});