/* eslint-disable */

import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import fs from 'fs';
import levelup from 'levelup';
import kad from 'kad';
import ip from 'ip';
import ping from 'ping';
import isOnline from 'is-online';
import async from 'async'
import { bufferToFile } from './file'
import { sendShredHandler, getShredHandler } from './shred';

import {
  storageDirPath,
  activityPatternPath,
  activityDays,
  deltaMinutes
} from './ENV_variables';

import { getUsedSpace } from './state';

const quasar = require('kad-quasar');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let node;
// let remaining_capacity=100; // ==> Now imported from StorageInfo()

let my_port;

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
    storage: levelup('./DHT_Storage.json', {db: require('jsondown')}),
    contact: { hostname: ip , port: port },
    identity: Buffer.from(networkID, 'hex')
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

  const shredsStoredPath = storageDirPath+'/';

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

function initHost( port, networkID, seed, callback) {
  console.log('ip: ' + ip.address());
  initDHT( ip.address(), port, networkID, seed, () => {
    initFileDelivery(port, () => {
      my_port=port;
      initSubscribe(my_port);      // subscribe to topic for hosting shreds
      trackActivityPattern(); // no callback (running function as long as the app is used )
      // console.log('Tracking using the Defaults activityPath');
      callback();
    });
  });
}

function loadActivityPattern(callback,activityPath) { // asynchronouslly loads the Activity Pattern
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : activityPatternPath;

  try {
    // load Activity Pattern from disk
    var activity;
    if (!fs.existsSync(activityPath))
    {
      createActivityPatternFile((result) => {
        activity = result;
      });
    } else { activity = JSON.parse(fs.readFileSync(activityPath));  }
    callback(activity,null);

  } catch(error)  { callback(null,error); }

}

function createActivityPatternFile(callback,deltaMinutes, activityDays, activityPath) { // asynchronouslly Creates the Activity Pattern File

  // Defaults :
  deltaMinutes = (typeof deltaMinutes !== 'undefined') ?  deltaMinutes : 10; // update activity every 10 min
  activityDays = (typeof activityDays !== 'undefined') ?  activityDays : 7; // activity for 1 week
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : activityPatternPath;

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)

  //  initalize your activity with all offline, Zero !
  const activity = {'lastDate':new Date() , 'Pattern': Array.apply(null, Array(activityParts) ).map(Number.prototype.valueOf,0) };
  fs.writeFileSync(activityPath, JSON.stringify(activity));
  console.log('Created ActivityPatternFile initalized all as offline !');
  callback(activity);

}

function trackActivityPattern( deltaMinutes, activityDays, activityPath ) {  /*  Track user's Activity Pattern &  Update the Activity Pattern File.
  Days: 0 Sunday, 1 Monday, 2 Tuesday, and etc. Minutes: between  0-59. Hours: between 0 and 23.     */


  // Defaults :
  deltaMinutes = (typeof deltaMinutes !== 'undefined') ?  deltaMinutes : 10; // update activity every 10 min
  activityDays = (typeof activityDays !== 'undefined') ?  activityDays : 7; // activity for 1 week
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : activityPatternPath;

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)
  var the_interval = deltaMinutes * 60 * 1000;

  // console.log('Successfuly load of the Activity Pattern !');
  // console.log('\tActivityParts = '+ activityParts);
  // console.log('\tPartsPerDay = '+ partsPerDay);
  // console.log('\tPartsPerHour = '+ partsPerHour);
  console.log('-------------------- Tracking Activity Pattern --------------------');
  console.log(new Date().toString());



    setInterval(()=> { // loop untill activity period finished
      loadActivityPattern((activity,error)=>{ //load the activity pattern
        if(error) { return console.error('Error in Tracking Activity Pattern !');  }

        var date = new Date();
        var lastDate = new Date(activity['lastDate']);
        var daysDiff = Math.abs(Math.floor((lastDate - date)/1000/60/60/24));      // Calculate the difference

        const now  = (date.getDay()*partsPerDay)  +  (date.getHours()*partsPerHour) + Math.floor(date.getMinutes()/deltaMinutes);
        const last = (lastDate.getDay()*partsPerDay)  +  (lastDate.getHours()*partsPerHour) + Math.floor(lastDate.getMinutes()/deltaMinutes);

        // console.log('Last Date was '+lastDate.toString());
        // console.log('Now is '+now+' , Last is '+last);

        if(daysDiff >= activityDays ) { // reset if last time was a old enough
            console.log('-------------------- Reseting Activity Pattern --------------------');
            activity = {'lastDate':date , 'Pattern': Array.apply(null, Array(activityParts) ).map(Number.prototype.valueOf,0) };            fs.writeFileSync(activityPath, JSON.stringify(activity));
            console.log('\tActivity Pattern Reseted')
        }
        else{ // equate indices between Last and Now to offline
          for (var i = last+1 ; (i%activityParts) != now; i++) {
            activity['Pattern'][i%activityParts]=0;
          }
        }

        isOnline().then(online =>{ // check for online conectivity
          if(online)
          {
            console.log('\tonline');
            activity['Pattern'][now] =  1; // online
          }
          else
          {
            activity['Pattern'][now] =  0; // offline
            console.log('\toffline');
          }

          //  update Activity Pattern
          activity['lastDate'] = date;
          fs.writeFileSync(activityPath, JSON.stringify(activity));
          console.log('\tActivity Pattern Updated');

        });
      });
    }, the_interval);

}

function initSubscribe(port){
    node.plugin(quasar);

    node.quasarSubscribe('icanhost', (broadcast) => {
        console.log('recieved a broadcast');
        loadActivityPattern((myactivity, error)=>{
            if(error){
                return console.error('failed to load activity pattern');
            }

            var mycontent = {
                ip: ip.address(),
                port: port,
                id: node.identity.toString('hex'),
                activity: myactivity
            }

            var uploaderip = broadcast['ip'];
            var uploaderid = broadcast['id'];
            var uploaderport = broadcast['port'];
            var shredsize = broadcast['shred_size'];

            const remaining_capacity = getUsedSpace()[0];


            // if(remaining_capacity > shredsize)
            if(remaining_capacity > shredsize && uploaderid != node.identity.toString('hex'))
            {
                const socket = socketclient(`http://${uploaderip}:${uploaderport}`);

                socket.on('connect', function (socket) {
                    console.log('Connected!');
                });

                socket.on('send.success', (yo) => {
                    console.log(yo);
                    socket.disconnect();
                });

                socket.emit('subscriber', mycontent);
            }
        });
    });
    console.log('Subscribed to icanhost.');
}

function getPeers(shredsize, callback){
    var counter = 0;

    var hosts = [];

    node.plugin(quasar);

    var broadcast = {
        ip: ip.address(),
        id: node.identity.toString('hex'),
        port: my_port+1,
        shred_size: shredsize
    }

    node.quasarPublish('icanhost', broadcast);

    io.on('connection', function (socket){
        console.log('connection');

        socket.on('subscriber', function (content) {
            hosts.push(content)
            socket.emit('send.success', 'response reached uploader.');
            counter++;

            console.log(counter);
            if(counter>=90)
            {
                console.log('should disconnect now');
                http.close();
            }
        });

    });

    http.listen(my_port+1, function () {
      console.log('listening for peer responses...');
    });

    setTimeout(()=>{
      console.log('timeout!');
      http.close();
      sortHosts(hosts, (newhosts)=>{
          console.log('Done sorting.');
          console.log(newhosts);
          callback(newhosts);
      });
    }, 10000);
}

function getPeerLatency(ip, callback) {

  ping.promise.probe(ip, { //configuration
          min_reply: 3, // should be odd number
      }).then( (res)=> {
        // console.log(res);
        if(res['time']=='unknown' && res['output']=='') { return console.error('unknown ya baba');}
        if(!res['alive'] ) { return console.error(ip+'is offline');}
        callback(res);
      });
}

function calculateMatching(hostactivity, callback) {  // the function recieves the host's activity in array form  const deltaMinutes =  10; it update activity every 10 min

  // const activityDays =  7; // activity for 1 week  ===> Now ENV variable
  // const activityPath = 'ActivityPattern.json';  ===> Now ENV variable

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)

  if( fs.existsSync(activityPatternPath) ) //use the existing the Activity Pattern
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

    return console.error('Error ! Activity Pattern File does not exists on path: '+activityPatternPath);
  }
}

function calculateHostAvailability(hostactivity, callback) {            // the function recieves the host's activity in array form
    // const deltaMinutes =  10; // update activity every 10 min  ===> Now ENV variable
    // const activityDays =  7; // activity for 1 week  ===> Now ENV variable

    //calculated variables
    const partsPerHour = Math.ceil(60/deltaMinutes);
    const partsPerDay  = Math.ceil(24*60/deltaMinutes);
    const activityParts = Math.ceil(activityDays * partsPerDay)

    var counter = 0;
    for (var i = 0; i < activityParts; i++) {
        if(hostactivity[i]==1)                // calculate how much time was the host available
            counter++;
    }
    callback(counter);
}

function calculateHostScore(ip, hostactivity, callback) {            // the function recieves the host's activity in array form

    var score = 0;

    var matching_weight = 0.45
    var availability_weight = 0.35
    var latency_weight = 0.2

    calculateMatching(hostactivity, (match)=>{
      //console.log(score);
      calculateHostAvailability(hostactivity, (availability)=>{
          //console.log(score);
          getPeerLatency(ip, (latency)=>{
              //console.log(score);
              //console.log(match);
              //console.log(availability);
              console.log(latency['avg']);                  //maximum acceptable latency = 500mss

              var totalscore = (0.45*match/1008) + (0.35*availability/1008) + (0.2*(500-latency['avg'])/500);

              callback(totalscore);
          });
      });
    });
}

function sortHosts(hosts, callback) {

    var asyncTasks = [];

    hosts.forEach(function(host){
        //var activity = host['activity'].toString().split(',');
        asyncTasks.push(function(callback){
            calculateHostScore(host['ip'], host['activity'], (score)=>{
                console.log(score);
                host['score']=score;
                callback();
            });

        });
    });

    async.parallel(asyncTasks, function(){
        // console.log('All is done.');
        hosts.sort(function(a, b) {
            return b['score'] - a['score'];
        });
        callback(hosts);
    });
}

export { node, initSubscribe, getPeers, initHost, initDHT, initFileDelivery, getPeerLatency, loadActivityPattern, createActivityPatternFile, trackActivityPattern, calculateHostAvailability, calculateMatching, calculateHostScore, sortHosts};
