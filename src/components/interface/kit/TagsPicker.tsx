import * as React from "react";
import { ChangeEvent } from "react";
import { Tag } from "../../../lib/data/Tag";
import { Api } from "../../../services/utils/Api";
import { Component } from "../../Component";

export interface TagsPickerProps {
  onChange: (tags: Tag[]) => void;
}

export interface TagsPickerState {
  focused: boolean;
  search: string;
  tagsAvailable: Tag[];
  tagsSearched: Tag[];
  tagsSelected: Tag[];
}

export class TagsPicker extends Component<TagsPickerProps, TagsPickerState> {
  state: TagsPickerState = {
    focused: false,
    search: "",
    tagsAvailable: [],
    tagsSearched: [],
    tagsSelected: [],
  };

  async onCreate() {
    this.setState({
      tagsAvailable: await Api.tagList(),
    });
  }
  onDestroy() {}

  onUpdateProps() {}
  onUpdateState() {}

  onUpdatePropsKey(k: string) {}
  onUpdateStateKey(k: string) {
    if (k === "search") {
      const search = this.state.search.toLocaleLowerCase();
      this.setState({
        tagsSearched: this.state.tagsAvailable.filter((tag) => {
          return this.isSearchMatch(tag, search);
        }),
      });
    }
    if (k === "tagsSelected") {
      this.props.onChange(this.state.tagsSelected);
    }
  }

  onRender() {
    return (
      <div onFocus={this.onFocus} onBlur={this.onBlur}>
        <input
          value={this.state.search}
          onChange={this.onSearchChange}
          className="
          flex-1
          appearance-none
          border
          border-transparent
          w-full
          py-2
          px-4
          text-gray-700
          placeholder-gray-400
          rounded-md
          text-base
          focus:outline-none
          focus:ring-2
          focus:ring-purple-600
          focus:border-transparent
          "
        />
        {this.onRenderDropdown()}
        {this.onRenderSelected()}
      </div>
    );
  }
  onRenderDropdown() {
    if (!this.state.focused) {
      return undefined;
    }
    return (
      <div className="flex">
        {this.state.tagsSearched.map((tag) => {
          return (
            <button
              key={tag.id}
              className=""
              onClick={() => {
                this.onTagAdd(tag);
              }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    );
  }

  onRenderSelected() {
    return (
      <div className="flex">
        {this.state.tagsSelected.map((tag) => {
          return (
            <button
              key={tag.id}
              className=""
              onClick={() => {
                this.onTagRemove(tag);
              }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    );
  }

  onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      search: event.target.value,
    });
  };

  onTagAdd = (tag: Tag) => {
    const tagsSelected = [...this.state.tagsSelected];
    tagsSelected.push(tag);
    this.setState({
      tagsSelected: this.dedup(tagsSelected),
    });
  };
  onTagRemove = (tag: Tag) => {
    const tagsSelected = this.state.tagsSelected.filter((tagSelected) => {
      return tagSelected.id !== tag.id;
    });
    this.setState({
      tagsSelected: this.dedup(tagsSelected),
    });
  };

  blurTimeout?: number;
  onFocus = () => {
    clearTimeout(this.blurTimeout);
    this.setState({
      focused: true,
    });
  };
  onBlur = () => {
    this.blurTimeout = setTimeout(() => {
      this.setState({
        focused: false,
      });
    });
  };

  isSearchMatch(tag: Tag, search: string) {
    return (
      tag.name.toLocaleLowerCase().indexOf(search) >= 0 ||
      tag.code.toLocaleLowerCase().indexOf(search) >= 0
    );
  }

  dedup(tags: Tag[]) {
    return [...new Set(tags)];
  }
}
