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
import {readFilesInfo, loadActivityPattern, fileMapPath, key, uploadMessage, NShreds, parity, targets} from '../utils/state';
import {shredFile, removeFileMapEntry, pre_send_path} from '../utils/file';
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

const filesButton = {
  padding: 0,
  width: '48%',
};
const filesUpload = {
  position: 'relative',
  bottom: '0px'
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
      fileName: '',
    };
  }

  handleChange = (e, results) => {
    const files = this.state.files.slice();
    let IDsofShreds;
    console.log(results);
    const uploadTime = new Date().toISOString().
                          substring(0,16).
                          replace(/T/, ' ').
                          replace(/\..+/, '');
    const fileKey = files.length + 1;
    results.forEach(result => {
      const [e, file] = result;
      shredFile(file.name,file.path,key,NShreds,parity, (shredIDs) => {
        console.log(shredIDs);
        IDsofShreds=shredIDs;
      })
      files.push({
        id: fileKey,
        shreds: IDsofShreds,
        name: file.name,
        status: 1,
        uploadTime: uploadTime,
        size: file.size/1000,
      });
    });
    this.setState({ files: files });
  }

  onClickDownload(fileName){
    const files = this.state.files.slice();
    for(var i in files) {
      if(files[i].name == fileName) {
        // call download from file.js
        files[i].status = 0;
        break;
      }
    }
    console.log('OnClickDownload: ');
    console.log(files);
    this.setState({ files: files, open: true, fileName: fileName });
    console.log(this.state);
  }

  onClickRemove(fileID){
    const files = this.state.files.slice();
    removeFileMapEntry(fileID, ()=> {
      console.log('File Removed successfully - fileMap');
    });
    for (var i in files){
      if (files[i].id == fileID){
        files.splice(i, 1);
        break;
      }
    }
    this.setState({ ...this.state, files: files });
  }

  render() {
    const files = this.state.files;
    let filesSize=0;
    for ( let i =0; i<this.state.files.length; i++) {
      filesSize+=files[i].size;
    }
    console.log(this.state.files);
    const filesElem = files.map((file) => {
      return (
        <TableRow>
          <TableRowColumn>{file.name}</TableRowColumn>
          <TableRowColumn>{`${file.size.toFixed(3)}KB`}</TableRowColumn>
          <TableRowColumn>{file.uploadTime}</TableRowColumn>
          <TableRowColumn>
            {
              <div>
                <LinearProgress mode="determinate" value={100} />
                {uploadMessage}
              </div>
            }
          </TableRowColumn>
          <TableRowColumn>
            { (file.status == 1) ?
              <FileFileDownload
                onTouchTap={()=>{this.onClickDownload(file.name)}}
                style={iconStyles}
                color={green200}
                hoverColor={greenA700}
              />
              :
              <ActionCheckCircle
                onTouchTap={()=>{this.onClickDownload(file.name)}}
                style={iconStyles}
                color={green200}
                hoverColor={greenA700}
              />
            }
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
            height='505px'
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
                <TableRowColumn style={{textAlign: 'left'}}>
                    <FlatButton
                      style={filesButton}
                      hoverColor='#FFFFFFF'
                      labelPosition="before"
                      disableTouchRipple={true}
                      label={`${(filesSize/1000).toFixed(2)}MB Space Used`}
                      secondary={true}
                      icon={<Storage />}
                    />
                    <FlatButton
                      style={filesButton}
                      hoverColor='#FFFFFFF'
                      label={`${this.state.files.length} Files Uploaded`}
                      disableTouchRipple={true}
                      labelPosition="before"
                      primary={true}
                      icon={<CloudDone />}
                    />
                  <FloatingActionButton style={filesUpload}>
                    <FileReaderInput id="my-file-input" onChange={this.handleChange}>
                      <ContentAdd />
                    </FileReaderInput>
                   </FloatingActionButton>
                </TableRowColumn>
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
        <Snackbar
          open={this.state.open}
          message={`${this.state.fileName} has been downloaded successfully`}
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
          autoHideDuration={3000}
        />
      </div>
    );
  }
}

export default LynksVault;
