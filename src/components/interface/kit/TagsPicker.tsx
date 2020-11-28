import * as React from "react";
import { ChangeEvent } from "react";
import { Tag, TagId } from "../../../lib/data/Tag";
import { Api } from "../../../services/utils/Api";
import { Component } from "../../Component";
import { TagList } from "./TagList";

export interface TagsPickerProps {
  tags?: Tag[];
  onChange: (tags: Tag[]) => void;
}

interface TagsPickerState {
  focused: boolean;
  search: string;
  tagsExisting: Tag[];
  tagsSearched: Tag[];
  tagsSelected: Tag[];
}

export class TagsPicker extends Component<TagsPickerProps, TagsPickerState> {
  state: TagsPickerState = {
    focused: false,
    search: "",
    tagsExisting: [],
    tagsSearched: [],
    tagsSelected: [],
  };

  searchInput = React.createRef<HTMLInputElement>();

  async onCreate() {
    this.debug = false;
    this.setState({
      tagsExisting: await Api.tagList(),
    });
  }

  async onUpdateProps(keys: Set<string>) {
    if (keys.has("tags")) {
      if (this.props.tags !== undefined) {
        this.setState({
          tagsSelected: this.props.tags,
        });
      }
    }
  }

  async onUpdateState(keys: Set<string>) {
    if (
      keys.has("search") ||
      keys.has("tagsExisting") ||
      keys.has("tagsSelected")
    ) {
      const tagsSelectedById = new Map<TagId, Tag>();
      for (const tagSelected of this.state.tagsSelected) {
        tagsSelectedById.set(tagSelected.id, tagSelected);
      }
      const search = this.state.search.toLocaleLowerCase();
      this.setState({
        tagsSearched: this.state.tagsExisting
          .filter((tag) => {
            return !tagsSelectedById.has(tag.id);
          })
          .filter((tag) => {
            return this.utilMatchTagSearch(tag, search);
          }),
      });
    }
  }

  onRender() {
    return (
      <div
        onFocus={this.onSelectorFocus}
        onBlur={this.onSelectorBlur}
        className="relative"
      >
        {this.onRenderSelector()}
        {this.onRenderDropdown()}
      </div>
    );
  }

  onRenderSelector() {
    return (
      <button
        onClick={this.onSelectorClick}
        className="
          flex
          flex-row
          flex-wrap
          appearance-none
          border
          border-transparent
          w-full
          py-0.5
          px-1
          text-gray-700
          placeholder-gray-400
          rounded-md
          text-base
        "
      >
        <TagList tags={this.state.tagsSelected} onClick={this.onTagRemove} />
        {this.state.tagsSelected.length > 0 ? undefined : (
          <div className="my-1 mx-2">Select tags ...</div>
        )}
      </button>
    );
  }

  onRenderDropdown() {
    if (!this.state.focused) {
      return undefined;
    }
    return (
      <div className="flex flex-col absolute bg-white w-full shadow-md rounded-md z-10">
        <input
          ref={this.searchInput}
          value={this.state.search}
          onChange={this.onSearchChange}
          placeholder="Search ..."
          className="
            appearance-none
            border
            border-transparent
            flex-grow
            mx-2
            mt-2
            py-1
            px-2
            bg-gray-300
            text-gray-700
            placeholder-gray-400
            rounded-md
            text-base
          "
        />
        <div className="flex flex-row flex-wrap m-1">
          {this.onRenderDropdownTags()}
        </div>
      </div>
    );
  }
  onRenderDropdownTags() {
    if (this.state.tagsSearched.length > 0) {
      return (
        <TagList
          tags={this.state.tagsSearched}
          buttons={true}
          onClick={this.onTagAdd}
        />
      );
    } else {
      return <div>No tag found</div>;
    }
  }

  /**
   * Search
   */
  onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      search: event.target.value,
    });
  };

  /**
   * Tag selection actions
   */
  onTagAdd = (tag: Tag) => {
    this.searchInput.current?.focus();
    const tagsSelected = [...this.state.tagsSelected];
    tagsSelected.push(tag);
    const newTagsSelected = this.utilDedup(tagsSelected);
    this.setState({
      tagsSelected: newTagsSelected,
    });
    this.props.onChange(newTagsSelected);
  };
  onTagRemove = (tag: Tag) => {
    this.searchInput.current?.focus();
    const tagsSelected = this.state.tagsSelected.filter((tagSelected) => {
      return tagSelected.id !== tag.id;
    });
    const newTagsSelected = this.utilDedup(tagsSelected);
    this.setState({
      tagsSelected: newTagsSelected,
    });
    this.props.onChange(newTagsSelected);
  };

  /**
   * Focus control
   */
  selectorBlurTimeout?: number;
  onSelectorClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    this.searchInput.current?.focus();
  };
  onSelectorFocus = () => {
    clearTimeout(this.selectorBlurTimeout);
    this.setState({
      focused: true,
    });
  };
  onSelectorBlur = () => {
    this.selectorBlurTimeout = setTimeout(() => {
      this.setState({
        focused: false,
      });
    });
  };

  /**
   * Utils
   */
  private utilMatchTagSearch(tag: Tag, search: string) {
    if (!search) {
      return true;
    }
    return (
      tag.name.toLocaleLowerCase().indexOf(search) >= 0 ||
      tag.code.toLocaleLowerCase().indexOf(search) >= 0
    );
  }
  private utilDedup(tags: Tag[]) {
    return [...new Set(tags)];
  }
}
