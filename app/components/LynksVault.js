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
import {readFilesNames} from '../utils/state';

const leftpaper = {
  position: 'relative',
  float: 'right',
  height: 600,
  width: 700,
  margin: 20,
  textAlign: 'right',
  display: 'inline-block',
};

const rightpaper = {
  position: 'relative',
  float: 'right',
  height: 600,
  width: 250,
  margin: 20,
  textAlign: 'right',
  display: 'inline-block',
};

const uploadButton = {
  margin: 15,
  width: 220,
  display: 'inline-block',
  float: 'center',
};

class LynksVault extends Component {
  constructor() {
    super();
    this.state = {
      files: readFilesNames()
    };
  }
  handleChange = (e, results) => {
    const files = this.state.files.slice();
    results.forEach(result => {
      const [e, file] = result;
      files.push(file.name);
    });
    this.setState({ files: files });
  }
  render() {
    const files = this.state.files;
    console.log(this.state.files);
    const filesElem = files.map((fileName) => {
      return (
        <TableRow>
          <TableRowColumn>File ID</TableRowColumn>
          <TableRowColumn>{fileName}</TableRowColumn>
          <TableRowColumn>Uploaded</TableRowColumn>
        </TableRow>
      )
    });
    return (
      <div>
        <Paper style={leftpaper} zDepth={1}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filesElem}
            </TableBody>
          </Table>
        </Paper>
        <Paper style={rightpaper} zDepth={1}>
          <FileReaderInput id="my-file-input" onChange={this.handleChange}>
            <RaisedButton label="Upload File" primary={true} style={uploadButton} />
          </FileReaderInput>
        </Paper>

        {/* <div className={styles.fileSelector}>
          <FileReaderInput id="my-file-input" onChange={this.handleChange}>
            <button type="button" className="btn btn-default btn-lg">
              <span className="glyphicon glyphicon-plus" aria-hidden="false" />
              {' Upload New Files'}
            </button>
          </FileReaderInput>
        </div>
        <div>
          <ol className={styles.listFiles}>
            {filesElem}
          </ol>
        </div> */}
      </div>
    );
  }
}

export default LynksVault;
