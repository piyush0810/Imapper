import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import {
  Router,
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import { store } from "./store";
import { AuthenticatedRoute } from "./customRoutes/ProtectedRoutes";

import Navigation from "./containers/NavigationContainer";
import HomePage from "./containers/HomePageContainer";
import Login from "./containers/auth/LoginContainer";
import Register from "./containers/auth/RegisterContainer";
import ChangePassword from "./containers/auth/ChangePasswordContainer";

import Image from "./components/Imapper/Image";

import ViewImage from "./components/Imapper/ViewImage";
import Home from "./components/Imapper/Home";
import View from "./components/Imapper/View";

import "./index.css";
export const history = createHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Navigation />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <AuthenticatedRoute exact path="/login" component={Login} />
          <AuthenticatedRoute exact path="/register" component={Register} />
          <Route exact path="/signout" render={() => <Redirect to="/" />} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route exact path="/addproject" component={Home} />
          <Route exact path="/image/:imageID" component={Image} />
          <Route exact path="/viewimage/:imageID" component={ViewImage} />
          <Route exact path="/view" component={View} />
        </Switch>
      </div>
    </Router>
  </Provider>,

  document.getElementById("root")
);
