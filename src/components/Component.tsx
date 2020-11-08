import React from "react";

export interface ComponentProps {}
export interface ComponentState {}

export abstract class Component<
  Props = ComponentProps,
  State = ComponentState
> extends React.Component<Props, State> {
  readonly id = "c-" + (Component._id++).toString(16);
  private static _id = 0;

  constructor(props: Readonly<Props>) {
    super(props);
    this.safe(this.onAlloc);
  }

  onRender(): React.ReactNode {
    return undefined;
  }

  onAlloc() {}
  onCreate() {}
  onDestroy() {}

  onUpdate() {}
  onUpdateProps() {}
  onUpdateState() {}

  async safe(cb: () => void) {
    try {
      await cb.call(this);
    } catch (e) {
      console.log("Error", e);
    }
  }

  componentDidMount() {
    this.safe(this.onCreate);
    this.safe(this.onUpdateProps);
    this.safe(this.onUpdateState);
    this.safe(this.onUpdate);
  }
  componentWillUnmount() {
    this.safe(this.onDestroy);
  }
  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<State>
  ) {
    for (const key in nextProps) {
      const value = nextProps[key];
      if (value !== this.props[key]) {
        return true;
      }
    }
    if ((nextState === null) !== (this.state === null)) {
      return true;
    } else {
      for (const key in nextState) {
        const value = nextState[key];
        if (value !== this.state[key]) {
          return true;
        }
      }
    }
    return false;
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    for (const key in prevProps) {
      const value = prevProps[key];
      if (value !== this.props[key]) {
        this.safe(this.onUpdateProps);
        break;
      }
    }
    if ((prevState === null) !== (this.state === null)) {
      this.onUpdateState();
    } else {
      for (const key in prevState) {
        const value = prevState[key];
        if (value !== this.state[key]) {
          this.safe(this.onUpdateState);
          break;
        }
      }
    }
    this.safe(this.onUpdate);
  }
  render() {
    try {
      return this.onRender() ?? [];
    } catch (e) {
      console.log("Error", e);
      return [];
    }
  }
}
