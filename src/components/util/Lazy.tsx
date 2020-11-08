import React from "react";

import { Component } from "../Component";

export interface LazyProps {
  width: string;
  height: string;
  delay?: number;
}

interface LazyState {
  visible?: boolean;
}

export class Lazy extends Component<LazyProps, LazyState> {
  private delay?: NodeJS.Timeout;
  private observer?: IntersectionObserver;
  private ref?: HTMLDivElement;
  onCreate() {
    this.observer = new IntersectionObserver(this.onIntersection, {
      threshold: 0,
    });
    if (this.ref) {
      this.observer.observe(this.ref);
    }
  }
  onDestroy() {
    if (this.observer) {
      if (this.ref) {
        this.observer.unobserve(this.ref);
      }
      this.observer.disconnect();
    }
    if (this.delay) {
      clearTimeout(this.delay);
    }
  }

  onRef = (ref: HTMLDivElement) => {
    if (this.ref) {
      this.observer?.unobserve(this.ref);
    }
    this.ref = ref;
    if (this.ref) {
      this.observer?.observe(this.ref);
    }
  };
  onIntersection = (entries: IntersectionObserverEntry[]) => {
    const visible = entries.some((entry) => {
      return entry.isIntersecting;
    });
    if (this.delay) {
      clearTimeout(this.delay);
    }
    this.delay = setTimeout(() => {
      this.setState({
        visible: visible,
      });
    }, this.props.delay ?? 100);
  };

  onRender() {
    return (
      <div
        ref={this.onRef}
        style={{
          position: "relative",
          width: this.props.width,
          height: this.props.height,
        }}
      >
        {this.state?.visible ? this.props.children : undefined}
      </div>
    );
  }
}
