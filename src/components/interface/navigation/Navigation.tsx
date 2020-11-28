import React from "react";
import { Link } from "react-router-dom";
import { Component } from "../../Component";

export class Navigation extends Component {
  onRender() {
    return (
      <div className="flex flex-column">
        <Link to="/chart/timeline">chart timeline</Link>
        <Link to="/chart/timecompare">chart timecompare</Link>
        <Link to="/browse/tags">browse tags</Link>
        <Link to="/browse/recent">browse recent</Link>
        <Link to="/track/new">track new</Link>
      </div>
    );
  }
}
