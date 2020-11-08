import React from "react";
import { Component } from "../Component";
import { Content } from "./content/Content";
import { Navigation } from "./navigation/Navigation";

export class Root extends Component {
  onRender() {
    return (
      <div>
        <Navigation />
        <Content />
      </div>
    );
  }
}
