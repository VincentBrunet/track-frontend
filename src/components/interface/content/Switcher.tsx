import React from "react";
import { Route, Switch } from "react-router-dom";
import { Component } from "../../Component";
import { ChartTimeline } from "../pages/chart/ChartTimeline";
import { TrackNew } from "../pages/track/TrackNew";

export class Switcher extends Component {
  onRender() {
    return (
      <Switch>
        <Route path="/track/new" component={TrackNew} />
        <Route path="/chart/timeline" component={ChartTimeline} />
        <Route path="/">Root</Route>
      </Switch>
    );
  }
}
