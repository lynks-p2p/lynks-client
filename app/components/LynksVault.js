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
import {readFilesInfo, markFileDownloaded, fileMapPath, key, uploadMessage, NShreds, parity, targets} from '../utils/state';
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


const uploadButton = {
  position: 'relative',
  left: 70,
  top: 30,
  width: 220,
  border: 'black',
};
const iconStyles = {
  marginRight: 20,
};
const buttonStyle1 = {
  position: 'relative',
  left: 70,
  top: 10,
  width: 220
};
const buttonStyle2 = {
  position: 'relative',
  left: 380,
  top: 10,
  width: 220
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
        size: `${file.size/1000}KB`,
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
    this.setState({ ...state, files: files });
  }

  render() {
    const files = this.state.files;
    console.log(this.state.files);
    const filesElem = files.map((file) => {
      return (
        <TableRow>
          <TableRowColumn>{file.name}</TableRowColumn>
          <TableRowColumn>{file.size}</TableRowColumn>
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
            height='512px'
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
                <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                  {/* <RaisedButton label="Files Uploaded: " style={buttonStyle1} />
                  <RaisedButton label="Space Used: " style={buttonStyle2}/> */}
                  <FloatingActionButton>
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
