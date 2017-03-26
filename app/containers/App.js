// @flow
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
