// @flow
/* eslint-disable */
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import styles from './LynksVault.css';
import {Line} from 'react-chartjs';
import {Doughnut} from 'react-chartjs';
import {loadActivityPattern} from '../utils/state';

var DoughnutChart = require("react-chartjs").Doughnut;

class LynksDrive extends Component {

  state = {
  data: loadActivityPattern('data'),
  labels: loadActivityPattern('labels'),
  availabilityData: {
    labels: loadActivityPattern('labels'),
    datasets: [
      {
        data: loadActivityPattern('data'),
      }
    ]
  },
  availabilityOptions: {
    responsive: true
  }
 };

 handleChange = ()=>{
   console.log('handleChange: ');
   console.log('Labels: ');
   console.log(loadActivityPattern('labels'));
   console.log('Data: ');
   console.log(loadActivityPattern('data'));
 }
 render() {
   return (
     <div>
       <Paper className={styles.filespaper} zDepth={1}>
         <Line
           data={{
             labels: this.state.labels,
             datasets:[
               {
                 data: this.state.data
               }
             ]
           }}
           options={this.state.availabilityOptions} width="150" height="50" />
      </Paper>
      <Paper className={styles.filespaper} zDepth={1}>
        <RaisedButton label="Drive Info: " onTouchTap={this.handlChange}/>
     </Paper>
     </div>
   );
 }
}

export default LynksDrive;
