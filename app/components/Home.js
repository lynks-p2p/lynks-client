/* eslint-disable */
// @flow
import React, { Component } from 'react';
import LynksVault from './LynksVault';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Upload from 'material-ui/svg-icons/file/file-upload';
import Drive from 'material-ui/svg-icons/editor/insert-drive-file';
import Share from 'material-ui/svg-icons/social/share';

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
        <Drawer open={true}>
          <Card>
             <CardHeader
               title="User 106"
               subtitle="Space Available XX"
             />
          </Card>
          <MenuItem
          primaryText="Lynks Vault"
          leftIcon={<Upload />}
          value={1}
          onTouchTap={()=>{this.setState({tab: 1});}}
          />
          <MenuItem
          primaryText="Lynks Drive"
          leftIcon={<Drive />}
          value={2}
          onTouchTap={()=>{this.setState({tab: 2});}}
          />
          <MenuItem
          primaryText="Lynks Drive"
          leftIcon={<Drive />}
          value={3}
          onTouchTap={()=>{this.setState({tab: 3});}}
          />
        </Drawer>
        <div>
          {this.state.tab == 1 ? <LynksVault /> : null}
        </div>
      </div>

    );
  }
}
