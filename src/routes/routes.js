import React from 'react';
import { Switch, Redirect, BrowserRouter } from 'react-router-dom';

import RouteWithLayout from './route_layout';
import Layout from '../@core/layout/layout';

import Home from '@page/home/home';
import Search from '../page/search/search';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/home" exact />
        <RouteWithLayout path="/home" layout={Layout} component={Home} exact />
        <RouteWithLayout
          path="/search"
          layout={Layout}
          component={Search}
          exact
        />
      </Switch>
    </BrowserRouter>
  );
}
