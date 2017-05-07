/* eslint-disable */
// @flow
import React, { Component } from 'react';
import LynksVault from './LynksVault';
import LynksDrive from './LynksDrive';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Upload from 'material-ui/svg-icons/file/file-upload';
import Drive from 'material-ui/svg-icons/editor/insert-drive-file';
import Share from 'material-ui/svg-icons/social/share';
import styles from './Home.css';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {getStorageSpace} from '../utils/state';
import Subheader from 'material-ui/Subheader';
import {red200, green200, redA700, greenA700, greenA400} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import LoggOff from 'material-ui/svg-icons/file/cloud-off';
import { loginCall } from '../../draft_tests/upload';
import { singupCall } from '../../draft_tests/download';

const textfield = {
  marginLeft: 20,
};
const login = {
  height: 300,
  width: 300,
  marginTop: 150,
  marginLeft: 350,
  textAlign: 'center',
  display: 'inline-block',
  backgroundColor: 'rgb(230, 255, 255)',
};
const container = {
  marginTop:80,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
};
const container2 = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
};
const icon= {
    width: 36,
    height: 36,
    iconHoverColor: 'rgb(230, 0, 0)',
};
const small= {
    width: 72,
    height: 72,
    padding: 16,
};

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      logged: false,
      signUp: true, // signUp = false --> loggin
      tab: 1
    };
  }
  handleLogin = () => {
    loginCall(()=>{
      this.setState({...this.state, logged:true});
    });
  }
  handleSignUp = () => {
    singupCall(()=>{
      this.setState({...this.state, logged:true});
    })
  }
  handleLogOff = () => {
    console.log('Logging Off');
    this.setState({...this.state, logged:false});
    console.log(this.state);
  }
  render() {
    const app = (this.state.tab == 1) ? <LynksVault /> : <LynksDrive />;
    const title = (this.state.logged) ? 'UserName' : 'Logged Off';
    const totalSpace = getStorageSpace();
    const availableSpace = (totalSpace>=1024) ? totalSpace/1024 : totalSpace;
    const storageUnit = (totalSpace>=1024) ? 'Gb' : 'Mb';
    const subtitle = (this.state.logged) ? `${availableSpace+storageUnit}` : '';
    let signLog;
    if (this.state.logged){

    }
    return (
      <div>
          <Drawer className={styles.bar} open={true}>
            <Card>
              <div style={container2}>
                <CardHeader
                  title={title}
                  subtitle={subtitle}
                />
                <IconButton
                   iconStyle={styles.icon}
                   style={styles.small}
                   onTouchTap={this.handleLogOff}
                 >
                   <LoggOff
                     color={red200}
                     hoverColor={redA700}
                   />
                 </IconButton>
              </div>
            </Card>
            <MenuItem
            primaryText="Lynks Vault"
            leftIcon={<Upload />}LynksVault
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
            primaryText="Lynks Share"
            leftIcon={<Share />}
            value={3}
            onTouchTap={()=>{this.setState({tab: 3});}}
            />
          </Drawer>
          <div className={styles.app}>
            {
              this.state.logged?
              app
              :
              <Paper style={login} zDepth={2}>
                <Subheader style={{fontWeight:'bold'}}>Login or Sign up</Subheader>
                <TextField hintText="User Name" style={textfield} underlineShow={true} />
                <TextField hintText="Password" style={textfield} underlineShow={true} />
                <div style={container}>
                  <RaisedButton
                    label='Login'
                    secondary={true}
                    onTouchTap={this.handleLogin}
                  />
                  <RaisedButton
                    label='Sign Up'
                    primary={true}
                    onTouchTap={this.handleSignUp}
                  />
                </div>
              </Paper>
            }
          </div>
        }
      </div>

    );
  }
}
