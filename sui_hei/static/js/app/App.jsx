import React from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { QueryRenderer } from "react-relay";
import jQuery from "jquery";

import { IndexBody } from "./components/Index.jsx";
import { LeftBar } from "./components/SideBar.jsx";
import { MondaiListBody } from "./components/MondaiList.jsx";
import { MondaiAddBody } from "./components/MondaiAdd.jsx";
import { MondaiShowBody } from "./components/MondaiShow.jsx";
import { TopNavbar } from "./components/Navbar.jsx";

//import socketMiddleware from "./redux/socketMiddleware";
import common from "./common";

const App = () => (
  <BrowserRouter>
    <div>
      <LeftBar />
      <noscript>This appication requires javascript to function</noscript>
      <TopNavbar />
      <Switch>
        <Route exact path="/" component={IndexBody} />
        <Route exact path="/mondai" component={MondaiListBody} />
        <Route exact path="/mondai/show/:mondaiId" component={MondaiShowBody} />
        <Route exact path="/mondai/add" component={MondaiAddBody} />
        <Route render={() => <h1>NOT FOUND!</h1>} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default App;
