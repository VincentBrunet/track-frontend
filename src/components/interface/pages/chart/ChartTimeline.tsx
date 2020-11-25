import * as React from "react";
import { Line } from "react-chartjs-2";
import { Tag } from "../../../../lib/data/Tag";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { TagsPicker } from "../../kit/TagsPicker";

export interface ChartTimelineProps {}

export interface ChartTimelineState {
  tags: Tag[];
  chartData?: any;
  chartOptions?: any;
}

export class ChartTimeline extends Component<
  ChartTimelineProps,
  ChartTimelineState
> {
  state: ChartTimelineState = {
    tags: [],
  };

  async onCreate() {
    this.setState({
      tags: await Api.tagList(),
    });
  }

  onDestroy() {}

  onUpdateProps() {}

  async onUpdateStateKey(k: string) {
    if (k === "tags") {
      const values = await Api.valueListForTags(this.state.tags, "or", "asc");
      const chartValues = values
        .filter((value) => value.scalar !== null)
        .map((value) => {
          return {
            x: value.stamp.valueOf(),
            y: value.scalar,
          };
        });
      this.setState({
        chartData: {
          datasets: [
            {
              label: this.state.tags.map((tag) => tag.name).join(" + "),
              data: chartValues,
            },
          ],
        },
        chartOptions: {
          scales: {
            xAxes: [
              {
                type: "time",
              },
            ],
          },
        },
      });
    }
  }

  onRender() {
    return (
      <div>
        <TagsPicker onChange={this.onTagsChange} />
        <Line
          data={this.state.chartData ?? {}}
          options={this.state.chartOptions ?? {}}
        />
      </div>
    );
  }

  onTagsChange = (tags: Tag[]) => {
    this.setState({
      tags: tags,
    });
  };
}
