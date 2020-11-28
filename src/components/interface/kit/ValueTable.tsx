import moment from "moment";
import * as React from "react";
import { Tag, TagId } from "../../../lib/data/Tag";
import { Value } from "../../../lib/data/Value";
import { Api } from "../../../services/utils/Api";
import { Component } from "../../Component";
import { GenericTable } from "./GenericTable";
import { TagList } from "./TagList";

export interface ValueTableProps {
  values: Value[];
}

interface ValueTableStateHead {
  str?: string;
}
interface ValueTableStateBody {
  tags?: Tag[];
  str?: string;
}

interface ValueTableState {
  headData: ValueTableStateHead[][];
  bodyData: ValueTableStateBody[][];
}

export class ValueTable extends Component<ValueTableProps, ValueTableState> {
  state: ValueTableState = {
    headData: [],
    bodyData: [],
  };

  async onCreate() {
    this.setState({
      headData: [
        [{ str: "Date" }, { str: "Scalar" }, { str: "Title" }, { str: "Tags" }],
      ],
    });
  }

  async onUpdateProps(keys: Set<string>) {
    if (keys.has("values")) {
      const values = this.props.values;
      if (values.length > 0) {
        const tags = await Api.tagList();
        const tagById = new Map<TagId, Tag>();
        for (const tag of tags) {
          tagById.set(tag.id, tag);
        }
        const mapping = await Api.mappingForValues(values);
        this.setState({
          bodyData: values.map((value) => {
            return [
              { str: moment(value.stamp).format("lll") as string | undefined },
              { str: (value.scalar ?? "-") as string },
              { str: value.title as string | undefined },
              {
                tags: mapping.tagsByValue[value.id]?.map((tagId: any) => {
                  return tagById.get(tagId as TagId);
                }),
              },
            ];
          }),
        });
      } else {
        this.setState({
          bodyData: [[{ str: "No values" }]],
        });
      }
    }
  }

  onRender() {
    return (
      <GenericTable<ValueTableStateHead, ValueTableStateBody>
        headData={this.state.headData}
        bodyData={this.state.bodyData}
        headRender={this.onRenderHead}
        bodyRender={this.onRenderBody}
      />
    );
  }

  onRenderHead(headValue: ValueTableStateHead, x: number, y: number) {
    return <div>{headValue.str}</div>;
  }
  onRenderBody(bodyValue: ValueTableStateBody, x: number, y: number) {
    if (bodyValue.tags) {
      return <TagList minis={true} tags={bodyValue.tags} />;
    } else {
      return <div>{bodyValue.str}</div>;
    }
  }
}
