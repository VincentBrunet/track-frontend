import * as React from "react";

export interface ComponentProps {}
export interface ComponentState {}

export abstract class Component<
  Props = ComponentProps,
  State = ComponentState
> extends React.Component<Props, State> {
  private static s_id = 0;

  protected id = (Component.s_id++).toString();
  protected debug: boolean = false;

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
  protected onUpdateProps(keys: Set<string>) {}
  protected onUpdateState(keys: Set<string>) {}

  private async safe(cb: () => void) {
    if (this.debug) {
      console.log(this.id, cb.name);
    }
    try {
      await cb.call(this);
    } catch (e) {
      console.error(e);
    }
  }
  private async safe1<V>(cb: (v: V) => void, v: V) {
    if (this.debug) {
      console.log(this.id, cb.name, v);
    }
    try {
      await cb.call(this, v);
    } catch (e) {
      console.error(e);
    }
  }

  componentDidMount() {
    this.safe(this.onCreate);
    this.safe(this.onUpdate);
    this.prep(this.props, this.onUpdateProps);
    this.prep(this.state, this.onUpdateState);
  }
  componentWillUnmount() {
    this.safe(this.onDestroy);
  }

  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<State>
  ) {
    if (!this.equals(this.props, nextProps)) {
      if (this.debug) {
        console.log(this.id, "props changed");
      }
      return true;
    }
    if (!this.equals(this.state, nextState)) {
      if (this.debug) {
        console.log(this.id, "state changed");
      }
      return true;
    }
    return false;
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    this.safe(this.onUpdate);
    this.diff(this.props, prevProps, this.onUpdateProps);
    this.diff(this.state, prevState, this.onUpdateState);
  }

  render() {
    if (this.debug) {
      console.log(this.id, "onRender");
    }
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
    cb: (k: Set<string>) => void
  ) {
    /* eslint-disable */
    if (a === b) {
      return;
    }
    const keys = new Set<string>();
    if (a !== null) {
      for (const p in a) {
        if (a.hasOwnProperty(p)) {
          if (!b.hasOwnProperty(p)) {
            keys.add(p);
          } else if (a[p] !== b[p]) {
            keys.add(p);
          }
        }
      }
    }
    if (b !== null) {
      for (const p in b) {
        if (b.hasOwnProperty(p)) {
          if (!a.hasOwnProperty(p)) {
            keys.add(p);
          }
        }
      }
    }
    this.safe1(cb, keys);
    /* eslint-enable */
  }

  private prep<T>(v: Readonly<T>, cb: (keys: Set<string>) => void) {
    /* eslint-disable */
    const keys = new Set<string>();
    if (v !== null) {
      for (const p in v) {
        if (v.hasOwnProperty(p)) {
          keys.add(p);
        }
      }
    }
    this.safe1(cb, keys);
    /* eslint-enable */
  }
}
