import React from 'react';
global.React = React;
import {render} from 'react-dom';
import {Router} from 'react-router';
import RBAuthRoute from 'components/auth-route';

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import 'antd/dist/antd.css';
const browserHistory = useRouterHistory(createHistory)({
  basename: "/install"
});

const rootRoute = RBAuthRoute({
  path: '/',
  indexRoute: { onEnter: (nextState, replace) => replace('/init')},
  chunkLoader(cb) {
    cb(
      require('./home'),
      require('./routes/init'),
      require('./routes/project')
    );
  }
});

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('app')
);
