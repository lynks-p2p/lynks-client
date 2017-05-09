// @flow
/* eslint-disable */
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import styles from './LynksVault.css';
import {Line} from 'react-chartjs-2';
import {Doughnut} from 'react-chartjs-2';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Settings from 'material-ui/svg-icons/action/settings';
import DonutSmall from 'material-ui/svg-icons/action/donut-small';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import getSize from 'get-folder-size';
import Dialog from 'material-ui/Dialog';
import Slider from 'material-ui/Slider';

import {
  transform,
  reverse,
  loadActivityPattern,
  getStorageInfo,
  getStorageSpace,
  getUsedSpace,
  editStorage
} from '../utils/state';

import {
  maxStorageSlider,
  minStorageSlider,
} from '../utils/ENV_variables';

class LynksDrive extends Component {

  state = {
    refresh: true,
    slider: getStorageSpace(),
    dialog: false,
    availabilityData: {
      labels: loadActivityPattern('labels'),
      datasets: [
        {
          label: 'Your Availability',
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: loadActivityPattern('data'),
        },
        {
          label: 'Recommended Uptime',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: loadActivityPattern('average'),
        }
      ]
    },

    availabilityOptions: {
      maintainAspectRatio: false
    },

    StorageData: {
  	labels: [
    		'Empty',
    		'Used',
    	],
    	datasets: [{
    		data: getStorageInfo(),
    		backgroundColor: [
    		'#BDBDBD',
    		'#36A2EB',
    		],
    		hoverBackgroundColor: [
    		'#BDBDBD',
    		'#36A2EB',
    		]
    	}]
    }
 };

componentDidMount() {
   let kaka = setInterval(() => this.refresh(), 1000);
}

refresh(){
  console.log('Refreshing');
  const StorageData= {
  labels: [
      'Empty',
      'Used',
    ],
    datasets: [{
      data: getStorageInfo(),
      backgroundColor: [
      '#BDBDBD',
      '#36A2EB',
      ],
      hoverBackgroundColor: [
      '#BDBDBD',
      '#36A2EB',
      ]
    }]
  }
  this.setState({...this.state, StorageData: StorageData, refresh: true});
}
handleRefresh(){
  getUsedSpace();
};

handleOpenDialog = () => {
  this.setState({...this.state, dialog: true});
};

handleCancelDialog = () => {
  this.setState({...this.state, dialog: false});
};

handleSubmitDialog = () => {
  editStorage(this.state.slider);
  this.setState({...this.state, dialog: false});
};

handleSlider = (event, value) => {
  this.setState({...this.state, slider: transform(value)});
};

render() {
   const empty = this.state.StorageData.datasets[0].data[0];
   const used = this.state.StorageData.datasets[0].data[1];
   const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCancelDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmitDialog}
      />,
    ];
   return (
     <div>
       <Paper className={styles.filespaper} zDepth={1}>
         <Line
           data={this.state.availabilityData}
           width={150}
           height={48} />
      </Paper>
      <Paper className={styles.filespaper} zDepth={1}>
          <Doughnut
            data={this.state.StorageData}
            width={165}
            height={38} />
            <Table
              selectable={false}
            >
              <TableHeader
                adjustForCheckbox={false}
                displaySelectAll={false}
              >
                <TableRow>
                  <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                    <RaisedButton
                      labelPosition="before"
                      label='Manage Local Drive'
                      secondary={true}
                      icon={<Settings />}
                      onTouchTap={this.handleOpenDialog}
                    />
                    <Dialog
                      title="Edit Storage Settings"
                      actions={actions}
                      modal={false}
                      open={this.state.dialog}
                      onRequestClose={this.handleClose}
                    >
                      <span>{`Your current storage space is ${((empty+used)>=1024)?((empty+used)/1024).toFixed(2):empty+used}`}</span>
                      <span>{`${((empty+used)>=1024)?'GB':'MB'}`}</span>
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`(${(used>=1024)?(used/1024).toFixed(2):used.toFixed(2)}`}</span>
                      <span>{`${((used)>=1024)?'GB used)':'MB used)'}`}</span>
                      <Slider
                        min={minStorageSlider}
                        max={maxStorageSlider}
                        step={maxStorageSlider / 100}
                        value={reverse(this.state.slider)}
                        onChange={this.handleSlider}
                      />
                      <p>
                        <span>{`Selected sotrage: ${(this.state.slider>=1024)?(this.state.slider/1024).toFixed(2):this.state.slider}`}</span>
                        <span>{`${(this.state.slider>=1024)?'GB':'MB'}`}</span>
                      </p>
                      <span style={{color:'#FF0000', fontWeight:'lighter'}}>{(this.state.slider<used)?"(WARNING: SELECTED STORAGE LESS THAN USED STORAGE)":""}</span>
                    </Dialog>
                  </TableRowColumn>
                  <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                    <Chip style={{marginLeft: 70, textAlign: 'center'}}>
                      <Avatar color="#444" icon={<DonutSmall />} />
                      {`${((used/(used+empty))*100).toFixed(2)}% Used Space`}
                    </Chip>
                  </TableRowColumn>
                  <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                    <RaisedButton
                       label="Refresh "
                       labelPosition="before"
                       primary={true}
                       icon={<Refresh />}
                       onTouchTap={this.handleRefresh}/>
                  </TableRowColumn>
                </TableRow>
              </TableHeader>
            </Table>
     </Paper>
     </div>
   );
 }
}

export default LynksDrive;
