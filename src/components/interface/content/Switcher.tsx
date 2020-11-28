import React from "react";
import { Route, Switch } from "react-router-dom";
import { Component } from "../../Component";
import { BrowseRecent } from "../pages/browse/BrowseRecent";
import { BrowseTags } from "../pages/browse/BrowseTags";
import { ChartTimecompare } from "../pages/chart/ChartTimecompare";
import { ChartTimeline } from "../pages/chart/ChartTimeline";
import { TrackNew } from "../pages/track/TrackNew";

export class Switcher extends Component {
  onRender() {
    return (
      <Switch>
        <Route path="/track/new" component={TrackNew} />
        <Route path="/chart/timeline" component={ChartTimeline} />
        <Route path="/chart/timecompare" component={ChartTimecompare} />
        <Route path="/browse/tags" component={BrowseTags} />
        <Route path="/browse/recent" component={BrowseRecent} />
        <Route path="/">Root</Route>
      </Switch>
    );
  }
}
