import {  bufferToFile  } from './app/utils/file'
const fs = require('fs')
const isOnline = require('is-online');


let activity; // export this !

function trackActivityPattern( deltaMinutes, activityDays ) { //  Track user's Activity Pattern and saves it to a file named activity.txt

  // Defaults :
  deltaMinutes = (typeof deltaMinutes !== 'undefined') ?  deltaMinutes : 10; // update activity every 10 min
  activityDays = (typeof activityDays !== 'undefined') ?  activityDays : 7; // activity for 1 week

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)
  var the_interval = deltaMinutes * 60 * 1000;

  //initalize your activity with all offline, Zero !
  activity= Array.apply(null, Array(activityParts) ).map(Number.prototype.valueOf,0);
  var activitycounter=0;



  console.log('activityParts = '+ activityParts);
  console.log('partsPerDay = '+ partsPerDay);
  console.log('partsPerHour = '+ partsPerHour);
  console.log('-------------------- Tracking Activity Pattern --------------------');



  //  minutes between  0-59, hours between 0 and 23
  //  0 Sunday, 1 Monday, 2 Tuesday, and etc

  setInterval(()=> { // loop untill activity period finished
    activitycounter++;
    console.log(activitycounter+'/'+activityParts);
    isOnline().then(online =>{ // check for online conectivity

      if(online)
      {
        console.log('\tonline');
        var date = new Date();
        const index = (date.getDay()*partsPerDay)  +  (date.getHours()*partsPerHour) + Math.floor(date.getMinutes()/deltaMinutes);
        activity[index] =  1; // online
        bufferToFile('ActivityPattern.txt',activity,()=>{console.log('\tupdated')});
        if(activitycounter==activityParts-1) //  reset the activity back again
        {
          console.log('-------------------- Reseting Activity Pattern --------------------');
          activity  = Array.apply(null, Array(  Math.ceil(activityDays * partsPerDay)  ) ).map(Number.prototype.valueOf,0);
          activitycounter=0;
        }
      }
      else console.log('\toffline');
    });
  }, the_interval);

}

function loadActivityPattern(path,callback) { // asynchronouslly loads the Activity Pattern

  fs.readFile(path, function(err, f){
    activity = f.toString().split(',');
  });
}


//  Track user's Activity Pattern
 trackActivityPattern();

//  Load the user's Activity Pattern
 // loadActivityPattern('ActivityPattern.txt',()=>{
 //   console.log('Successfuly load the Activity Pattern !');
 // });




// ---------ALSO--------------

// you can also Track under specified deltaMinutes, activityDay
 // trackActivityPattern(1,1);

//  you can also load in sync. way
 //activity = fs.readFileSync('activity.txt').toString().split(',');
