import React from "react";
import { Value } from "../../../../lib/data/Value";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { ValueTable } from "../../kit/ValueTable";

export interface BrowseRecentProps {}

interface BrowseRecentState {
  values?: Value[];
}

export class BrowseRecent extends Component<
  BrowseRecentProps,
  BrowseRecentState
> {
  state: BrowseRecentState = {};

  async onCreate() {
    this.setState({
      values: await Api.valueListRecent(),
    });
  }

  onRender() {
    return (
      <div>
        <ValueTable values={this.state.values ?? []} />
      </div>
    );
  }
}
