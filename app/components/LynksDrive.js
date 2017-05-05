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
import {loadActivityPattern, getStorageInfo} from '../utils/state';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Settings from 'material-ui/svg-icons/action/settings';
import DonutSmall from 'material-ui/svg-icons/action/donut-small';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import getSize from 'get-folder-size';

class LynksDrive extends Component {

  state = {
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
handleRefresh(){
   console.log(getStorageInfo());
  //  this.forceUpdate();
 }
handleOpenDialog = () => {
  this.setState({...state, dialog: true});
};

handleCloseDialog = () => {
  this.setState({...state, dialog: false});
};
render() {
   const empty = this.state.StorageData.datasets[0].data[0];
   const used = this.state.StorageData.datasets[0].data[1];

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
