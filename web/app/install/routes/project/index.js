import RBAuthRoute from 'components/auth-route';

export default RBAuthRoute({
  path: '/project',
  chunkLoader(cb) {
    cb(
      require('./home')
    );
  }
});