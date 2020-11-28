import * as React from "react";
import { Tag } from "../../../../lib/data/Tag";
import { Value } from "../../../../lib/data/Value";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { TagList } from "../../kit/TagList";
import { TagsPicker } from "../../kit/TagsPicker";
import { ValueTable } from "../../kit/ValueTable";

export interface BrowseTagsProps {}

export interface BrowseTagsState {
  tags: Tag[];
  values?: Value[];

  recent?: Tag[];
  related?: Tag[];
}

export class BrowseTags extends Component<BrowseTagsProps, BrowseTagsState> {
  state: BrowseTagsState = {
    tags: [],
  };

  async onCreate() {
    this.setState({
      recent: await Api.tagListForValues(await Api.valueListRecent()),
    });
    await Api.mappingForValues(await Api.valueListRecent());
  }

  async onUpdateState(keys: Set<string>) {
    if (keys.has("tags")) {
      const tags = this.state.tags;
      if (tags.length > 0) {
        this.setState({
          values: await Api.valueListForTags(tags, "and", "desc"),
        });
      } else {
        this.setState({
          values: undefined,
        });
      }
    }
    if (keys.has("values")) {
      const values = this.state.values;
      if (values) {
        this.setState({
          related: await Api.tagListForValues(values),
        });
      } else {
        this.setState({
          related: undefined,
        });
      }
    }
  }

  onRender() {
    const tags = this.state.tags;
    const values = this.state.values;
    const recent = this.state.recent;
    const related = this.state.related;
    return (
      <div className="flex flex-col">
        <TagsPicker tags={tags} onChange={this.onTagsChange} />
        {values !== undefined ? <ValueTable values={values} /> : undefined}
        {recent !== undefined && related === undefined ? (
          <>
            Recent:
            <TagList
              tags={recent ?? []}
              buttons={true}
              onClick={this.onTagChange}
            />
          </>
        ) : undefined}
        {related !== undefined ? (
          <>
            Related:
            <TagList
              tags={related ?? []}
              buttons={true}
              onClick={this.onTagChange}
            />
          </>
        ) : undefined}
      </div>
    );
  }

  onTagsChange = (tags: Tag[]) => {
    const length = tags.length;
    if (length > 0) {
      this.setState({
        tags: [tags[length - 1]],
      });
    } else {
      this.setState({
        tags: [],
      });
    }
  };

  onTagChange = (tag: Tag) => {
    this.setState({
      tags: [tag],
    });
  };
}
