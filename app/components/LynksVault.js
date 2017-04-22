// @flow
/* eslint-disable */
import { Button } from 'react-bootstrap';
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

const uploadButton = {
  position: 'relative',
  left: 70,
  top: 30,
  width: 220,
  border: 'black',
};

class LynksVault extends Component {
  constructor() {
    super();
    this.state = {
      files: readFilesInfo()
    };
  }
  handleChange = (e, results) => {
    console.log(results);
    results.forEach(result => {
      const [e, file] = result;
      shredFile(file.name,file.path,key,NShreds,parity, (shredIDs) => {
        console.log(shredIDs);
      })
    });
    this.setState({ files: readFilesInfo() });
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
          <TableRowColumn>Download - Delete</TableRowColumn>
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
          <Table>
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
