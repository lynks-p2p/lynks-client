import {  bufferToFile } from './app/utils/file'
const fs = require('fs')
const isOnline = require('is-online');




function calculateMatching(hostactivity, callback, score) {            // the function recieves the host's activity in array form

    const deltaMinutes =  10; // update activity every 10 min
    const activityDays =  7; // activity for 1 week
    const activityPath = 'ActivityPattern.txt';

    //calculated variables
    const partsPerHour = Math.ceil(60/deltaMinutes);
    const partsPerDay  = Math.ceil(24*60/deltaMinutes);
    const activityParts = Math.ceil(activityDays * partsPerDay)

    if( fs.existsSync(activityPath) ) //use the existing the Activity Pattern
    {

      loadActivityPattern((activity)=>{

        console.log('Successful load of Uploader Activity Pattern !');

        var counter = 0;
        for (var i = 0; i < activityParts; i++) {
            if(hostactivity[i]==1 && activity[i]==1)
                counter++;
        }
        callback(counter);
      });
    } else {  //  Activity Pattern File doesn't exit

      return console.error('Error ! Activity Pattern File does not exists on path: '+activityPath);
    }
}




function loadActivityPattern(callback,activityPath) { // asynchronouslly loads the Activity Pattern
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.txt';

  fs.readFile(activityPath, function(err, f){
    if(err){ return console.error('Failed To load the Activity Pattern file on path: '+ activityPath );   }
    callback(f.toString().split(','));
  });
}

function createActivityPatternFile(callback,deltaMinutes, activityDays, activityPath) { // asynchronouslly Creates the Activity Pattern File

  // Defaults :
  deltaMinutes = (typeof deltaMinutes !== 'undefined') ?  deltaMinutes : 10; // update activity every 10 min
  activityDays = (typeof activityDays !== 'undefined') ?  activityDays : 7; // activity for 1 week
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.txt';

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)

  //  initalize your activity with all offline, Zero !
  activity = Array.apply(null, Array(activityParts) ).map(Number.prototype.valueOf,0);

  bufferToFile(activityPath,activity,()=>{ // Created Activity Pattern File
    console.log('Successfuly Created Activity Pattern File !')
    callback(activity);
  });

}


function trackActivityPattern( deltaMinutes, activityDays, activityPath ) {  /*  Track user's Activity Pattern &  Update the Activity Pattern File.
    Days: 0 Sunday, 1 Monday, 2 Tuesday, and etc. Minutes: between  0-59. Hours: between 0 and 23.     */

  // Defaults :
  deltaMinutes = (typeof deltaMinutes !== 'undefined') ?  deltaMinutes : 10; // update activity every 10 min
  activityDays = (typeof activityDays !== 'undefined') ?  activityDays : 7; // activity for 1 week
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.txt';

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)
  var the_interval = deltaMinutes * 60 * 1000;


  if( fs.existsSync(activityPath) ) //use the existing the Activity Pattern
  {

    loadActivityPattern((activity)=>{

      console.log('Successfuly load of the Activity Pattern !');
      console.log('\tActivityParts = '+ activityParts);
      console.log('\tPartsPerDay = '+ partsPerDay);
      console.log('\tPartsPerHour = '+ partsPerHour);
      console.log('\tReseting Date is Sunday, Hour 00, and at any minute betwwen 00 and '+(deltaMinutes-1));
      console.log('-------------------- Tracking Activity Pattern --------------------');
      console.log(new Date().toString());
      setInterval(()=> { // loop untill activity period finished
        isOnline().then(online =>{ // check for online conectivity

          if(online)
          {
            console.log('\tonline');
            var date = new Date();
            const index = (date.getDay()*partsPerDay)  +  (date.getHours()*partsPerHour) + Math.floor(date.getMinutes()/deltaMinutes);
            activity[index] =  1; // online
            bufferToFile('ActivityPattern.txt',activity,()=>{console.log('\tActivity Pattern Updated')});
            if(index==0) // resets if it was Sunday  00:00 => 00:(deltaMinutes-1)
            {
              console.log('-------------------- Reseting Activity Pattern --------------------');
              console.log('\tReseting Date is Sunday, Hour 00, and at any minute betwwen 00 and '+(deltaMinutes-1));
              activity  = Array.apply(null, Array(  Math.ceil(activityDays * partsPerDay)  ) ).map(Number.prototype.valueOf,0);
              bufferToFile('ActivityPattern.txt',activity,()=>{console.log('\tActivity Pattern Reseted')});
            }
          } else console.log('\toffline');

        });
      }, the_interval);

    });
  } else {  //  Activity Pattern File doesn't exit

    return console.error('Error ! Activity Pattern File does not exists on path: '+activityPath);
    }
}



//
// createActivityPatternFile((activity)=>{
//   console.log('\tActivity file was Created using the Defaults parameters');
//   trackActivityPattern(1,1,'testing.txt');
// },1,1,'testing.txt');

// loadActivityPattern((activity)=>{
//   console.log('activity file path was loaded using the Defaults activityPath');
//   console.log('activity.length '+activity.length);
//   const v= new Date();
//   console.log(v.getDay());
// });

//console.log('Tracking  using the Defaults activityPath');
//trackActivityPattern();

console.log('Calculating score of compatibility..');

loadActivityPattern((activity)=>{
  console.log('activity pattern of host is loaded..');
  calculateMatching(activity, (score)=>{
      console.log(score);
  });
});


// you can also Track under specified deltaMinutes, activityDay, and activityPath

   // trackActivityPattern(2);  //deltaMinutes=2,activityDays=7,activityPath='ActivityPattern.txt'

   // trackActivityPattern(2,11); //deltaMinutes=2,activityDays=11,activityPath='ActivityPattern.txt'

   // trackActivityPattern(2,11,'anyfilepath.txt');//deltaMinutes=2,activityDays=11,activityPath='anyfilepath.txt'
