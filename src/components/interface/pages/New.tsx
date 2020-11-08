import React from "react";
import { Component } from "../../Component";

export class New extends Component {
  onRender() {
    return (
      <div>
        new value:
        <div>
          scalar:
          <input />
        </div>
        <div>
          title:
          <input />
        </div>
        <div>
          comment:
          <textarea />
        </div>
      </div>
    );
  }
}
