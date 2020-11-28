import * as React from "react";
import { Component } from "../../Component";

export interface GenericTableProps<H, B> {
  headData: H[][];
  bodyData: B[][];
  headRender: (v: H, x: number, y: number) => JSX.Element;
  bodyRender: (v: B, x: number, y: number) => JSX.Element;
}

interface GenericTableState {}

export class GenericTable<H, B> extends Component<
  GenericTableProps<H, B>,
  GenericTableState
> {
  state: GenericTableState = {};

  onRender() {
    return (
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>{this.onRenderHead()}</thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {this.onRenderBody()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onRenderHead() {
    const headData = this.props.headData;
    if (headData.length <= 0) {
      return;
    }
    return headData.map((headRow, y) => {
      return (
        <tr key={y}>
          {headRow.map((headValue, x) => {
            return this.onRenderHeadCell(headValue, x, y);
          })}
        </tr>
      );
    });
  }
  onRenderHeadCell(headValue: H, x: number, y: number) {
    return (
      <th
        key={x}
        scope="col"
        className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      >
        {this.props.headRender(headValue, x, y)}
      </th>
    );
  }

  onRenderBody() {
    const bodyData = this.props.bodyData;
    if (bodyData.length <= 0) {
      return;
    }
    return bodyData.map((bodyRow, y) => {
      return (
        <tr key={y}>
          {bodyRow.map((bodyValue, x) => {
            return this.onRenderBodyCell(bodyValue, x, y);
          })}
        </tr>
      );
    });
  }
  onRenderBodyCell(bodyValue: B, x: number, y: number) {
    return (
      <td key={x} className="px-3 py-2 whitespace-nowrap">
        {this.props.bodyRender(bodyValue, x, y)}
      </td>
    );
  }
}
