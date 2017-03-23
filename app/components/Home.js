// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import LynksVault from './LynksVault'

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      tab: 1
    };
  }
  render() {
    return (
      <div>
        <div className={styles.tab}>
          <button className={styles.tablinks} onClick={() => { this.setState({ tab: 1 }); }}>
            Lynks Vault
          </button>
          <button className={styles.tablinks} onClick={() => { this.setState({ tab: 2 }); }}>
            Lynks Drive
          </button>
          <button className={styles.tablinks} onClick={() => { this.setState({ tab: 3 }); }}>
            Lynks Share
          </button>
        </div>
        <div className={styles.app}>
          {this.state.tab === 1 ? <LynksVault /> : null }
        </div>
      </div>
    );
  }
}
