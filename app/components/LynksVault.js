// @flow
/* eslint-disable */
import React, { Component } from 'react';
import FileReaderInput from 'react-file-reader-input';
import { Line } from 'rc-progress';
import {Grid, Row, Column} from 'react-cellblock';
// import { ListGroup, ListGroupItem } from 'react-bootstrap';
import styles from './LynksVault.css';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {readFilesInfo, loadActivityPattern} from '../utils/state';
import {shredFile, removeFileMapEntrySync, removeFileMapEntryLocally} from '../utils/file';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import ActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import {red200, green200, redA700, greenA700, greenA400} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import CloudDone from 'material-ui/svg-icons/file/cloud-done';
import Storage from 'material-ui/svg-icons/device/storage';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { upload, download } from '../utils/file';
import CircularProgress from 'material-ui/CircularProgress';

import {
  uploadMessage,
  fileMapPath,
  pre_send_path
} from '../utils/ENV_variables';

const filesButton = {
  padding: 0,
  height: '100%'
};

const iconStyles = {
  marginRight: 20,
};



class LynksVault extends Component {

  constructor() {
    super();
    this.state = {
      files: readFilesInfo(),
      notification: false,
      notificationMessage: ''
    };
  }

  onClickUpload = (e, results) => {
    const files = this.state.files.slice();
    let notificationMessage;
    const uploadTime = new Date().toISOString().
                          substring(0,16).
                          replace(/T/, ' ').
                          replace(/\..+/, '');
    const fileKey = files.length + 1;
    let filePath;
    results.forEach(result => {
      const [e, file] = result;
      filePath = file.path;
      notificationMessage = file.name + ' has been uploaded successfully';
      files.push({
        id: fileKey,
        name: file.name,
        progressStatus: 0,
        status: 'Ready to upload...',
        uploadTime: uploadTime,
        size: file.size/1024,
      });
  })
    this.setState({ files: files });
    upload(filePath, this.setState.bind(this), this.state, fileKey, ()=>{
      this.setState({ files: readFilesInfo(), notification: true, notificationMessage: notificationMessage});
    });
  }

  onClickDownload(fileID){
    const files = this.state.files.slice();
    let notificationMessage;
    for(var i in files) {
      if(files[i].id == fileID) {
        notificationMessage = files[i].name + ' has been downloaded successfully';
        break;
      }
    }
    download(fileID, this.setState.bind(this), this.state, ()=>{
      this.setState({ ...this.state, notification: true, notificationMessage: notificationMessage });
    });
  }

  onClickRemove(fileID){
    const files = this.state.files.slice();
    let notificationMessage;
    for (var i in files){
      if (files[i].id == fileID){
        notificationMessage = files[i].name + ' has been deleted successfully';
        // files.splice(i, 1);
        break;
      }
    }
    removeFileMapEntrySync(fileID, ()=> {
      console.log('File Removed successfully - fileMap');
      this.setState({ files: readFilesInfo(), notification: true, notificationMessage: notificationMessage});
    });
  }

  handleRequestClose = () => {
    this.setState({...state, notification:false, notificationMessage:''});
  };
  render() {
    const files = this.state.files;
    let filesSize=0;
    for ( let i =0; i<this.state.files.length; i++) {
      filesSize+=files[i].size;
    }
    console.log(this.state.files);
    const filesElem = files.map((file) => {
      let fileSize = file.size;
      let fileUnit = 'KB'
      if (file.size>(1024*1024)){
        fileSize = file.size / 1024 / 1024;
        fileUnit = 'GB';
      } else if(file.size>1024){
        fileSize = file.size / 1024;
        fileUnit = 'Mb';
      }
      // download - downloading - downloaded icons component

      let downloadIcon;

      if (file.progressStatus === 100 && file.status != 'Downloaded'){
        downloadIcon = <FileFileDownload
                        onTouchTap={()=>{this.onClickDownload(file.id)}}
                        style={iconStyles}
                        color={green200}
                        hoverColor={greenA700}
                      />;
      } else if (file.status === 'Downloaded') {
        downloadIcon = <ActionCheckCircle
                        onTouchTap={()=>{this.onClickDownload(file.id)}}
                        style={iconStyles}
                        color={green200}
                        hoverColor={greenA700}
                      />
      } else {
        downloadIcon = <CircularProgress size={20} style={iconStyles}/>;
      }
      return (
        <TableRow>
          <TableRowColumn>{file.name}</TableRowColumn>
          <TableRowColumn>{fileSize.toFixed(2)+fileUnit}</TableRowColumn>
          <TableRowColumn>{file.uploadTime}</TableRowColumn>
          <TableRowColumn>
            {
              <div>
                <LinearProgress mode="determinate" color={(file.progressStatus==100)?greenA700:''} value={file.progressStatus} />
                {file.status}
              </div>
            }
          </TableRowColumn>
          <TableRowColumn>
            {downloadIcon}
            <ActionDeleteForever
              onTouchTap={()=>{this.onClickRemove(file.id)}}
              style={iconStyles}
              color={red200}
              hoverColor={redA700}
            />
          </TableRowColumn>
        </TableRow>
      )
    });
    return (
      <div>
        <Paper className={styles.filespaper} zDepth={1}>
          <Table
            height='518px'
            selectable={false}
          >
            <TableHeader
              adjustForCheckbox={false}
              displaySelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Size</TableHeaderColumn>
                <TableHeaderColumn>Upload date</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox= {false}
              showRowHover={false}
            >
              {filesElem}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableRowColumn colSpan="3" style={{textAlign: 'left'}}>
                    <FlatButton
                      style={filesButton}
                      hoverColor='#FFFFFFF'
                      labelPosition="before"
                      disableTouchRipple={true}
                      label={`${(filesSize/1024).toFixed(2)}MB Used Space`}
                      secondary={true}
                      icon={<Storage />}
                    />
                </TableRowColumn>
                <TableRowColumn colSpan="3" style={{textAlign: 'left'}}>
                  <FlatButton
                    style={filesButton}
                    hoverColor='#FFFFFFF'
                    label={`${this.state.files.length} Files Uploaded`}
                    disableTouchRipple={true}
                    labelPosition="before"
                    primary={true}
                    icon={<CloudDone />}
                  />
                </TableRowColumn>
                <TableRowColumn style={{textAlign: 'right', paddingBottom: '4px'}}>
                  <FloatingActionButton mini={true} colSpan="3">
                    <FileReaderInput  onChange={this.onClickUpload}>
                      <ContentAdd />
                    </FileReaderInput>
                   </FloatingActionButton>
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
        <Snackbar
          open={this.state.notification}
          message={`${this.state.notificationMessage}`}
          onRequestClose={this.handleRequestCloseDialog}
          action={
            <IconButton
              iconStyle={styles.mediumIcon}
              style={styles.medium}
            >
              <ActionCheckCircle
              style={iconStyles}
              color={green200}
              />
            </IconButton>
          }
          autoHideDuration={2500}
        />
      </div>
    );
  }
}

export default LynksVault;
