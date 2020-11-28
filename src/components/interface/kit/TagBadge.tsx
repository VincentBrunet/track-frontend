import * as React from "react";
import { Tag } from "../../../lib/data/Tag";
import { Component } from "../../Component";

export interface TagBadgeProps {
  mini?: boolean;
  button?: boolean;
  tag: Tag;
  onClick?: (tag: Tag) => void;
}

interface TagBadgeState {}

export class TagBadge extends Component<TagBadgeProps, TagBadgeState> {
  state: TagBadgeState = {};

  onRender() {
    const rootClass = "flex flex-row bg-blue-300 px-2 rounded-xl truncate";
    if (this.props.button) {
      return (
        <button className={rootClass} onClick={this.onClick}>
          {this.onRenderContent()}
        </button>
      );
    } else {
      return (
        <div className={rootClass} onClick={this.onClick}>
          {this.onRenderContent()}
        </div>
      );
    }
  }

  onRenderContent() {
    if (this.props.mini) {
      return [
        <div key="n" className="px-px">
          {this.props.tag.name[0]}
          {this.props.tag.name[1]}
        </div>,
      ];
    } else {
      return [
        <div key="i" className="px-1">
          -
        </div>,
        <div key="n" className="px-px">
          {this.props.tag.name}
        </div>,
      ];
    }
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.tag);
    }
  };
}
