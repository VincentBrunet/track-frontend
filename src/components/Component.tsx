import * as React from "react";

export interface ComponentProps {}
export interface ComponentState {}

export abstract class Component<
  Props = ComponentProps,
  State = ComponentState
> extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.safe(this.onAlloc);
  }

  protected onAlloc() {}
  protected onCreate() {}
  protected onDestroy() {}

  protected onRender(): React.ReactNode | undefined {
    return undefined;
  }

  protected onUpdate() {}
  protected onUpdateProps() {}
  protected onUpdateState() {}

  protected onUpdatePropsKey(k: Extract<keyof Props, string>) {}
  protected onUpdateStateKey(k: Extract<keyof State, string>) {}

  private async safe(cb: () => void) {
    try {
      await cb.call(this);
    } catch (e) {
      console.error(e);
    }
  }
  private async safe1<V>(cb: (v: V) => void, v: V) {
    try {
      await cb.call(this, v);
    } catch (e) {
      console.error(e);
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
    if (!this.equals(this.props, nextProps)) {
      return true;
    }
    if (!this.equals(this.state, nextState)) {
      return true;
    }
    return false;
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    this.diff(this.props, prevProps, this.onUpdatePropsKey);
    if (!this.equals(this.props, prevProps)) {
      this.safe(this.onUpdateProps);
    }
    this.diff(this.state, prevState, this.onUpdateStateKey);
    if (!this.equals(this.state, prevState)) {
      this.safe(this.onUpdateState);
    }
    this.safe(this.onUpdate);
  }

  render() {
    try {
      return this.onRender() ?? [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  private equals<T>(a: Readonly<T>, b: Readonly<T>) {
    /* eslint-disable */
    if ((a === null) !== (b === null)) {
      return false;
    }
    if (a === b) {
      return true;
    }
    for (const p in a) {
      if (a.hasOwnProperty(p)) {
        if (!b.hasOwnProperty(p)) {
          return false;
        }
        if (a[p] !== b[p]) {
          return false;
        }
      }
    }
    for (const p in b) {
      if (b.hasOwnProperty(p)) {
        if (!a.hasOwnProperty(p)) {
          return false;
        }
      }
    }
    return true;
    /* eslint-enable */
  }

  private diff<T>(
    a: Readonly<T>,
    b: Readonly<T>,
    cb: (k: Extract<keyof T, string>) => void
  ) {
    /* eslint-disable */
    if (a === b) {
      return;
    }
    for (const p in a) {
      if (a.hasOwnProperty(p)) {
        if (!b.hasOwnProperty(p)) {
          this.safe1(cb, p);
        } else if (a[p] !== b[p]) {
          this.safe1(cb, p);
        }
      }
    }
    for (const p in b) {
      if (b.hasOwnProperty(p)) {
        if (!a.hasOwnProperty(p)) {
          this.safe1(cb, p);
        }
      }
    }
    return true;
    /* eslint-enable */
  }
}
