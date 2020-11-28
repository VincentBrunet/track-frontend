import * as React from "react";
import { Tag } from "../../../lib/data/Tag";
import { Component } from "../../Component";
import { TagBadge } from "./TagBadge";

export interface TagListProps {
  minis?: boolean;
  buttons?: boolean;
  tags: Tag[];
  onClick?: (tag: Tag) => void;
}

interface TagListState {}

export class TagList extends Component<TagListProps, TagListState> {
  state: TagListState = {};

  async onCreate() {}
  async onDestroy() {}

  async onUpdateProps(keys: Set<string>) {}
  async onUpdateState(keys: Set<string>) {}

  onRender() {
    return (
      <div className="flex flex-row flex-wrap">
        {this.props.tags.map((tag) => {
          return (
            <div key={tag.id} className="m-1">
              <TagBadge
                mini={this.props.minis}
                button={this.props.buttons}
                tag={tag}
                onClick={this.props.onClick}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
