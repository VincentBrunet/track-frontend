import React from "react";
import { Component } from "../../Component";
import { Switcher } from "./Switcher";

export class Content extends Component {
  onRender() {
    return <Switcher />;
  }
}
