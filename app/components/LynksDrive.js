// @flow
/* eslint-disable */
import { Button } from 'react-bootstrap';
import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

class LynksDrive extends Component {
  state = {
   finished: false,
   stepIndex: 0,
 };

 handleNext = () => {
   const {stepIndex} = this.state;
   this.setState({
     stepIndex: stepIndex + 1,
     finished: stepIndex >= 2,
   });
 };

 handlePrev = () => {
   const {stepIndex} = this.state;
   if (stepIndex > 0) {
     this.setState({stepIndex: stepIndex - 1});
   }
 };

 getStepContent(stepIndex) {
   switch (stepIndex) {
     case 0:
       return 'Select Drive';
     case 1:
       return 'What is an ad group anyways?';
     case 2:
       return 'This is the bit I really care about!';
     default:
       return 'You\'re a long way from home sonny jim!';
   }
 }

 render() {
   const {finished, stepIndex} = this.state;
   const contentStyle = {margin: '0 16px'};

   return (
     <div style={{width: '100%', height:600, maxWidth: 700, margin: 'auto'}}>
       <Stepper activeStep={stepIndex}>
         <Step>
           <StepLabel>Link Your Drive</StepLabel>
         </Step>
         <Step>
           <StepLabel>Select Storage Amount</StepLabel>
         </Step>
         <Step>
           <StepLabel>Start hosting files</StepLabel>
         </Step>
       </Stepper>
       <div style={contentStyle}>
         {finished ? (
           <p>
             <a
               href="#"
               onClick={(event) => {
                 event.preventDefault();
                 this.setState({stepIndex: 0, finished: false});
               }}
             >
               Click here
             </a> to reset the example.
           </p>
         ) : (
           <div>
             <p>{this.getStepContent(stepIndex)}</p>
             <div style={{marginTop: 12}}>
               <FlatButton
                 label="Back"
                 disabled={stepIndex === 0}
                 onTouchTap={this.handlePrev}
                 style={{marginRight: 12}}
               />
               <RaisedButton
                 label={stepIndex === 2 ? 'Finish' : 'Next'}
                 primary={true}
                 onTouchTap={this.handleNext}
               />
             </div>
           </div>
         )}
       </div>
     </div>
   );
 }
}

export default LynksDrive;
