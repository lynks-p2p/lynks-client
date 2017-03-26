/* eslint-disable */
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Nav, NavItem } from 'react-bootstrap';
import styles from './Home.css';
import LynksVault from './LynksVault';


export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      tab: 1
    };
  }
  handleSelect (tabNum) {
    this.setState({tab: tabNum});
  }
  render() {
    return (
      <div>
        <div>
          <Nav bsStyle="pills" justified onSelect={this.handleSelect.bind(this)}>
            <NavItem eventKey={1} >Lynks Vault</NavItem>
            <NavItem eventKey={2} >Lynks Drive</NavItem>
            <NavItem eventKey={3} >Lynks Share</NavItem>
          </Nav>
        </div>
        <div className={styles.app}>
          {this.state.tab == 1 ? <LynksVault /> : null}
        </div>
      </div>

      // <div>
      //   <div className={styles.tab}>
      //     <Button bsStyle="success" onClick={() => { this.setState({ tab: 1 }); }}>
      //       Lynks Vault
      //     </Button>
      //     <button className={styles.tablinks} onClick={() => { this.setState({ tab: 2 }); }}>
      //       Lynks Drive
      //     </button>
      //     <button className={styles.tablinks} onClick={() => { this.setState({ tab: 3 }); }}>
      //       Lynks Share
      //     </button>
      //   </div>
      //   <div className={styles.app}>
      //     {this.state.tab === 1 ? <LynksVault /> : null }
      //   </div>
      // </div>
    );
  }
}
