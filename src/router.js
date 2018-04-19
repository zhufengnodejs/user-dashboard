import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import App from './routes/App';
import IndexPage from './routes/IndexPage';
import UserPage from './routes/UserPage';
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <App>
        <Switch>
          <Route path="/" exact component={IndexPage} />
          <Route path="/users" exact component={UserPage} />
        </Switch>
      </App>
    </Router>
  );
}

export default RouterConfig;
