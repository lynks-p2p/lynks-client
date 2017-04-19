
// const send_shred_request = require ('../../communication/client.js').send_shred_request;
// const send_store_request = require ('../../communication/client.js').send_store_request;
// const shredFile = require ('./file.js').shredFile;
// const readFileMap = require ('./file.js').readFileMap;
// const reconstructFile = require ('./file.js').reconstructFile;


import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import fs from 'fs';
import levelup from 'levelup';
import kad from 'kad';
import ip from 'ip';
import ping from 'ping';
import isOnline from 'is-online';
import {  bufferToFile } from './file'
import { sendShredHandler, getShredHandler } from './shred';


let node;

function initDHT(ip, port, networkID, seed, callback) {
  //MyIp , myID : strings
  //myPort : int, preferably 8080
  //mySeed is an object of that shape:-
                    //   const seed = [
                    //   'hostname_IDENTITY',
                    //   { hostname: 'hostname_IP', port: hostname_PORT }
                    // ];


  //TO DO:  use the hash(myID) and not the myID
  node = kad({
    transport: new kad.UDPTransport(),
    storage: levelup('./DHT_Storage/'),
    contact: { hostname: ip , port: port },
    identity: Buffer.from(networkID)
  });



  const logsOn = false;

  if (logsOn) {
    node.use((request, response, next) => {
      console.log('\n---------------------------------------------------------')
      console.log('## REQ')
      console.log(request)
      console.log('## RES')
      console.log(response)
      console.log('---------------------------------------------------------\n')

      next();
    });
  }

  node.listen(port, () => {
    node.join(seed, () => {
      console.log('Successfuly connected to Seed '+seed[1]['hostname']+':'+seed[1]['port']);
      callback();
    })
  });
}

function initFileDelivery(port, callback) {
  const io  = socketio.listen(port);
  // console.log('listening: '+ ip);

  const shredsStoredPath = './Storage/';

  io.sockets.on('connection', (socket) => {
    console.log('connected');

    socket.on('retrieve_shred', (data) => {
      console.log ('received a shred request!');
      sendShredHandler(socket, data.shredID, shredsStoredPath, () => {
        console.log('shred sent success');
      });
    });

    socket.on('store_shred', function (data) {
      console.log('received a store request!');
      getShredHandler(socket, data.shredID, shredsStoredPath, () => {
        console.log('shred stored success');
      });
    });

    socket.on('disconnect', function() {
      console.log('socket closed');
    });
  });

  callback();
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

function initHost( port, networkID, seed, callback) {
  initDHT( ip.address(), port, networkID, seed, () => {
    initFileDelivery(port, () => {

      console.log('Tracking  using the Defaults activityPath');
      trackActivityPattern(); // no callback (running function as long as the app is used )

      callback();
    });
  });
}

function getPeers() {
  // get list of n best peers


  return 0;
}

function getPeerLatency(ip,callback) {

  ping.promise.probe(ip, { //configuration
          min_reply: 3, // should be odd number
      }).then( (res)=> {
        // console.log(res);
        if(res['time']=='unknown' && res['output']=='') { return console.error('unknown ya baba');}
        if(!res['alive'] ) { return console.error(ip+'is offline');}
        callback(res);
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







function shred_and_send(public_ip, public_port, filename, filepath, key, NShreds, parity) {
  shredFile(filename, filepath + filename, key, NShreds, parity, (shredIDs)=>{
    console.log ('done shredding');
    send_store_request(public_ip, public_port, shredIDs, (path) => {
      var fs = require ('fs');
      for (var index in shredIDs) {
        fs.unlink(path + shredIDs[index], () => {});
      }
    });
  });
}

function receive_and_gather(public_ip, public_port, fileID, callback) {

  // CHANGE ME: parameterized shreds name, file sizes, number of shreds, targets length... etc.

  readFileMap((fileMap) => {
    const file = fileMap[fileID];
    if (file) {
      const shredIDs = file['shreds'];

      var shuffle = require('shuffle-array');
      var requiredShreds = [];
      for (var i=0; i<shredIDs.length; i++){
        requiredShreds.push(i);
      }
      shuffle(requiredShreds);
      requiredShreds = requiredShreds.slice(0, 10);

      var targets = 0x3FFFFFFF;
      // -1 ^ (3 << 30);
      console.log('intial targets' + targets.toString(2));
      // ~( target & 0);
      for (var i=0; i < requiredShreds.length; i++){
        // if (requiredShreds.indexOf(shredIDs[i]) >= 0) {
        targets ^= (1 << requiredShreds[i]);
        requiredShreds[i] = 'shred_' + requiredShreds[i]
        // }
      }
      console.log('targets: ' + targets.toString(2));
      console.log('chosen shreds: ' + requiredShreds);
      send_shred_request(public_ip, public_port, requiredShreds, (shredspath) => {
        reconstructFile(fileID, targets, shredIDs, shredspath, () => {
          callback();
        });
      });
    } else callback('error');
  });
}

export { node, getPeers, initHost,initDHT, initFileDelivery,getPeerLatency,loadActivityPattern,createActivityPatternFile,trackActivityPattern, shred_and_send, receive_and_gather };
