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
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {readFilesInfo, fileMapPath, key, NShreds, parity} from '../utils/state';
import {shredFile} from '../utils/file';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ActionDeleteForever from 'material-ui/svg-icons/action/delete-forever';
import {red800, green500} from 'material-ui/styles/colors';

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

class LynksVault extends Component {
  constructor() {
    super();
    this.state = {
      files: readFilesInfo()
    };
  }
  handleChange = (e, results) => {
    const files = this.state.files.slice();
    console.log(results);
    const uploadTime = new Date().toISOString().
                          substring(0,16).
                          replace(/T/, ' ').
                          replace(/\..+/, '');
    results.forEach(result => {
      const [e, file] = result;
      files.push({
        name: file.name,
        uploadTime: uploadTime,
        size: `${file.size/1000}KB`,
      });
      shredFile(file.name,file.path,key,NShreds,parity, (shredIDs) => {
        console.log(shredIDs);
      })
    });
    this.setState({ files: files });
  }
  render() {
    const files = this.state.files;
    console.log(this.state.files);
    const filesElem = files.map((file) => {
      return (
        <TableRow>
          <TableRowColumn>File ID</TableRowColumn>
          <TableRowColumn>{file.name}</TableRowColumn>
          <TableRowColumn>{file.size}</TableRowColumn>
          <TableRowColumn>{file.uploadTime}</TableRowColumn>
          <TableRowColumn>Uploaded</TableRowColumn>
          <TableRowColumn>
              <FileFileDownload style={iconStyles} color={green500} />
              <ActionDeleteForever  style={iconStyles} color={red800} />
          </TableRowColumn>
        </TableRow>
      )
    });
    return (
      <div>
        <Paper className={styles.buttonspaper} zDepth={1}>
          <FileReaderInput id="my-file-input" onChange={this.handleChange}>
              <RaisedButton label="Upload File" style={uploadButton} primary={true}  />
          </FileReaderInput>
        </Paper>
        <Paper className={styles.filespaper} zDepth={1}>
          <Table
            height='460px'
          >
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Size</TableHeaderColumn>
                <TableHeaderColumn>Upload date</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filesElem}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default LynksVault;
