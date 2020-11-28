import * as React from "react";
import { Line } from "react-chartjs-2";
import { Tag } from "../../../../lib/data/Tag";
import { Api } from "../../../../services/utils/Api";
import { Component } from "../../../Component";
import { TagsPicker } from "../../kit/TagsPicker";

export interface ChartTimecompareProps {}

export interface ChartTimecompareState {
  series: Tag[][];
  chartData?: any;
  chartOptions?: any;
}

export class ChartTimecompare extends Component<
  ChartTimecompareProps,
  ChartTimecompareState
> {
  state: ChartTimecompareState = {
    series: [[], [], [], []],
  };

  async onUpdateState(keys: Set<string>) {
    if (keys.has("series")) {
      const chartDatasets: any[] = [];
      for (const tags of this.state.series) {
        if (tags.length <= 0) {
          continue;
        }
        const values = await Api.valueListForTags(tags, "and", "desc");
        chartDatasets.push({
          label: tags.map((tag) => tag.name).join(" & "),
          data: values
            .filter((value) => value.scalar !== null)
            .map((value) => {
              return {
                x: value.stamp.valueOf(),
                y: value.scalar,
              };
            }),
        });
      }
      this.setState({
        chartData: {
          datasets: chartDatasets,
        },
        chartOptions: {
          legend: { position: "bottom" },
          scales: {
            xAxes: [{ type: "time" }],
          },
        },
      });
    }
  }

  onRender() {
    let hasValues = false;
    const datasets = this.state.chartData?.datasets;
    if (datasets) {
      for (const dataset of datasets) {
        hasValues = hasValues || dataset.data.length > 0;
      }
    }
    return (
      <div>
        {this.onRenderPickers()}
        <div className="py-3"></div>
        {hasValues ? (
          <Line
            data={this.state.chartData ?? {}}
            options={this.state.chartOptions ?? {}}
          />
        ) : (
          <div>No data</div>
        )}
      </div>
    );
  }
  onRenderPickers() {
    return this.state.series.map((tags, index) => {
      return (
        <div key={index} className="py-2">
          <div className="py-1">Series {index}:</div>
          <TagsPicker
            tags={tags}
            onChange={(tags: Tag[]) => {
              this.onTagsChange(index, tags);
            }}
          />
        </div>
      );
    });
  }

  onTagsChange = (index: number, tags: Tag[]) => {
    const series = [...this.state.series];
    series[index] = tags;
    this.setState({
      series: series,
    });
  };
}
