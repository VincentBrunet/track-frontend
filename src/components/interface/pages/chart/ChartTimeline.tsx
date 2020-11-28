import * as React from "react";
import { Line } from "react-chartjs-2";
import { Tag } from "../../../../lib/data/Tag";
import { Value } from "../../../../lib/data/Value";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { TagsPicker } from "../../kit/TagsPicker";
import { ValueTable } from "../../kit/ValueTable";

export interface ChartTimelineProps {}

export interface ChartTimelineState {
  tags: Tag[];
  values?: Value[];
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

  async onUpdateState(keys: Set<string>) {
    if (keys.has("tags")) {
      if (this.state.tags.length > 0) {
        const values = await Api.valueListForTags(
          this.state.tags,
          "and",
          "desc"
        );
        const chartValues = values
          .filter((value) => value.scalar !== null)
          .map((value) => {
            return {
              x: value.stamp.valueOf(),
              y: value.scalar,
            };
          });
        this.setState({
          values: values,
          chartData: {
            datasets: [
              {
                label: this.state.tags.map((tag) => tag.name).join(" & "),
                data: chartValues,
              },
            ],
          },
          chartOptions: {
            legend: { position: "bottom" },
            scales: {
              xAxes: [{ type: "time" }],
            },
          },
        });
      } else {
        this.setState({
          values: undefined,
          chartData: undefined,
          chartOptions: undefined,
        });
      }
    }
  }

  onRender() {
    return (
      <div>
        <TagsPicker tags={this.state.tags} onChange={this.onTagsChange} />
        <div className="py-3"></div>
        {this.state.chartData && this.state.chartOptions ? (
          <Line
            data={this.state.chartData ?? {}}
            options={this.state.chartOptions ?? {}}
          />
        ) : undefined}
        {this.state.values ? (
          <ValueTable values={this.state.values ?? []} />
        ) : (
          <div>No data</div>
        )}
      </div>
    );
  }

  onTagsChange = (tags: Tag[]) => {
    this.setState({
      tags: tags,
    });
  };
}
