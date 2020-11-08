import React from "react";
import { Route, Switch } from "react-router-dom";
import { Component } from "../../Component";
import { New } from "../pages/New";

export class Switcher extends Component {
  onRender() {
    return (
      <Switch>
        <Route path="/new" component={New} />
        <Route path="/">Root</Route>
      </Switch>
    );
  }
}
