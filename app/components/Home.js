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
import LogOff from 'material-ui/svg-icons/file/cloud-off';
import { login, signup, logoff } from '../utils/auth';

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
      logged: false,
      signUp: true, // signUp = false --> loggin
      tab: 1,
      username: '',
      password: ''
    };
  }
  handleLogin = () => {
    login(this.state.username, this.state.password, (userId,err)=>{
      if (!err) {
        console.log('Welcome '+userId);
        this.setState({...this.state, logged:true});
      }
    })
  }
  handleSignUp = () => {
    signup(this.state.username, this.state.password, (userId,err)=>{
      if (!err) {
        console.log('Sign up successful '+userId);
        // this.setState({...this.state, logged:true});
      }
    })
  }
  handleLogOff = () => {
    console.log('Logging Off');
    logoff((err) => {
      if (!err) {
        this.setState({...this.state, logged:false, username: null, password: null});
      }
    })

    // console.log(this.state);
  }
  render() {
    const app = (this.state.tab == 1) ? <LynksVault /> : <LynksDrive />;
    const title = (this.state.logged) ? this.state.username : 'Logged Off';
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
              <Paper style={loginStyle} zDepth={2}>
                <Subheader style={{fontWeight:'bold'}}>Login or Sign up</Subheader>
                <TextField floatingLabelText="Username" value={this.state.username} onChange={(e, val) => this.setState({...this.state, username: val})}/>
                <br/>
                <TextField floatingLabelText="Password" type="password" value={ this.state.password} onChange={(e, val) => this.setState({...this.state, password: val})}/>
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
