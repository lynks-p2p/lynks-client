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
import {getStorageSpace, getCredit} from '../utils/state';
import Subheader from 'material-ui/Subheader';
import {red200, green200, redA700, greenA700, greenA400} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import AlertError from 'material-ui/svg-icons/alert/error';
import LogOff from 'material-ui/svg-icons/file/cloud-off';
import { login, signup, logoff } from '../utils/auth';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';

import {
  vaultIconPath,
  driveIconPath,
  shareIconPath
} from '../utils/ENV_variables';

const textfield = {
  marginLeft: '10%',
};
const loginStyle = {
  height: '50%',
  width: '50%',
  marginTop: '15%',
  marginLeft: '25%',
  paddingBottom: '4%',
  textAlign: 'center',
  display: 'inline-block',
  backgroundColor: 'rgb(230, 255, 255)'
};
const iconStyles = {
  marginRight: 20,
};
const container = {
  marginTop: '10%',
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
      notification: false,
      notificationMessage: '',
      logged: false,
      loggingIn: false,
      requesting: false,
      signUp: true, // signUp = false --> loggin
      tab: 1,
      username: '',
      password: '',
      errorNotification: true
    };
  }
  handleLogin = () => {
    this.setState({...this.state, notification: false, requesting: true, loggingIn: true});
    login(this.state.username, this.state.password, (userId,err)=>{
      if (!err) {
        this.setState({...this.state, notification: false, logged:true, requesting: false, loggingIn: false});
      } else {
        this.setState({...this.state, errorNotification: true, notification: true, requesting: false, notificationMessage: err});
      }
    })
  }
  handleSignUp = () => {
    this.setState({...this.state, notification: false, requesting: true, loggingIn: false});
    signup(this.state.username, this.state.password, (userId,err)=>{
      if (!err) {
        this.setState({...this.state, notification: false, requesting: false, loggingIn: false});
      } else {
        this.setState({...this.state, errorNotification: true, notification: true, requesting: false, notificationMessage: err});
      }
    });
  }
  handleLogOff = () => {
    console.log('Logging Off');
    logoff((err) => {
      if (!err) {
        this.setState({...this.state, errorNotification: false, notification: true, notificationMessage: 'Logged Off Successfully', logged:false, username: null, password: null});
      }
    })

    // console.log(this.state);
  }
  handleRequestClose = () => {
    this.setState({...this.state, notification:false, notificationMessage:''});
  };
  render() {
    const app = (this.state.tab == 1) ? <LynksVault /> : <LynksDrive />;
    const title = (this.state.logged) ? this.state.username : 'Logged Off';
    const totalSpace = getStorageSpace();
    const availableSpace = (totalSpace>=1024) ? totalSpace/1024 : totalSpace;
    // const storageUnit = (totalSpace>=1024) ? 'GB' : 'MB';
    // const subtitle = (this.state.logged) ? `${availableSpace.toFixed(2)}${storageUnit}` : '';
    const subtitle = (this.state.logged) ? `${getCredit()} Ł` : '';
    let signLog;

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
                   {
                     this.state.logged?
                     <LogOff
                       color={red200}
                       hoverColor={redA700}
                     />
                     :
                     null
                   }

                 </IconButton>
              </div>
            </Card>
            <MenuItem
            primaryText="Lynks Vault"
            leftIcon={<img src={vaultIconPath} />}
            value={1}
            onTouchTap={()=>{this.setState({...this.state, notification: false, tab: 1});}}
            />
            <MenuItem
            primaryText="Lynks Drive"
            leftIcon={<img src={driveIconPath} />}
            value={2}
            onTouchTap={()=>{this.setState({...this.state, notification: false, tab: 2});}}
            />
            <MenuItem
            primaryText="Lynks Share"
            leftIcon={<img src={shareIconPath} />}
            value={3}
            onTouchTap={()=>{this.setState({...this.state, notification: false, tab: 3});}}
            />
          </Drawer>
          <div className={styles.app}>
            {
              this.state.logged ?
              app
              :
              this.state.requesting ?
              // IMAGE HERE
              <Paper style={loginStyle} zDepth={2}>
                <img src="../resources/loading.gif" />
                <div style={{textAlign: 'center', verticalAlign: 'middle', fontSize: '20px', padding: '20px'}}>
                  { this.state.loggingIn ? 'LOGGING IN...' : 'SIGNING UP...'}
                </div>
              </Paper>
              :
              <Paper style={loginStyle} zDepth={2}>
                <Subheader style={{fontWeight:'bold'}}>Login or Sign up</Subheader>
                <TextField floatingLabelText="Username" value={this.state.username} onChange={(e, val) => this.setState({...this.state, notification: false, username: val})}/>
                <br/>
                <TextField floatingLabelText="Password" type="password" value={ this.state.password} onChange={(e, val) => this.setState({...this.state, notification: false, password: val})}/>
                <div style={container}>
                  <RaisedButton
                    label='Sign Up'
                    secondary={true}
                    onTouchTap={this.handleSignUp}
                  />
                  <RaisedButton
                    label='Login'
                    primary={true}
                    onTouchTap={this.handleLogin}
                  />
                </div>
              </Paper>
            }
          </div>
          <Snackbar
            open={this.state.notification}
            message={`${this.state.notificationMessage}`}
            onRequestClose={this.handleRequestCloseDialog}
            action={
              <IconButton
                iconStyle={styles.mediumIcon}
                style={styles.medium}
              >
                {
                  (this.state.errorNotification)?
                  <AlertError
                  style={iconStyles}
                  color={redA700}
                  />
                  :
                  <ActionCheckCircle
                  style={iconStyles}
                  color={green200}
                  />
                }
              </IconButton>
            }
            autoHideDuration={2500}
          />
      </div>

    );
  }
}
