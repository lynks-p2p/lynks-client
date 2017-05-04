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

const quasar = require('kad-quasar');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let node;
let remaining_capacity=100;

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

function initHost( port, networkID, seed, callback) {
  initDHT( ip.address(), port, networkID, seed, () => {
    initFileDelivery(port, () => {

      console.log('Tracking using the Defaults activityPath');

      node.plugin(quasar);

      node.quasarSubscribe('icanhost', (broadcast) => {
          console.log('recieved sth');
          loadActivityPattern((myactivity)=>{

              var mycontent = {
                  ip: ip.address(),
                  port: port,
                  id: node.identity.toString('hex'),
                  activity: myactivity
              }

              var uploaderip = broadcast['ip'];
              var uploaderport = broadcast['port'];
              var shredsize = broadcast['shred_size'];

              if(remaining_capacity > shredsize)
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
      console.log('Subscribed');

      trackActivityPattern(); // no callback (running function as long as the app is used )

      callback();
    });
  });
}

function loadActivityPattern(callback,activityPath) { // asynchronouslly loads the Activity Pattern
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.json';

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
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.json';

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
  activityPath = (typeof activityPath !== 'undefined') ?  activityPath : 'ActivityPattern.json';

  //calculated variables
  const partsPerHour = Math.ceil(60/deltaMinutes);
  const partsPerDay  = Math.ceil(24*60/deltaMinutes);
  const activityParts = Math.ceil(activityDays * partsPerDay)
  var the_interval = deltaMinutes * 60 * 1000;

  // console.log('Successfuly load of the Activity Pattern !');
  console.log('\tActivityParts = '+ activityParts);
  console.log('\tPartsPerDay = '+ partsPerDay);
  console.log('\tPartsPerHour = '+ partsPerHour);
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

function getPeers(callback, newhosts){
    var counter = 0;

    var hosts = [];

    node.plugin(quasar);

    var broadcast = {
        ip: ip.address(),
        port: 3000,
        shred_size: 90
    }

    node.quasarPublish('icanhost', broadcast);

    io.on('connection', function (socket){
        console.log('connection');

        socket.on('subscriber', function (content) {
            hosts.push(content)
            socket.emit('send.success', 'response reached uploader.');
            counter++;

            console.log(counter);
            if(counter==3)
            {
                console.log('should disconnect now');
                http.close();
            }
        });

    });

    http.listen(3000, function () {
      console.log('listening on *:3000');
    });

    setTimeout(()=>{
      console.log('timeout!');
      http.close();
      sortHosts(hosts, (newhosts)=>{
          console.log('Done sorting.');
          callback(newhosts);
      });
    }, 10000);
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

function calculateMatching(hostactivity, callback, score) {            // the function recieves the host's activity in array form

    const deltaMinutes =  10; // update activity every 10 min
    const activityDays =  7; // activity for 1 week
    const activityPath = 'ActivityPattern.json';

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

function calculateHostAvailability(hostactivity, callback, score) {            // the function recieves the host's activity in array form

    const deltaMinutes =  10; // update activity every 10 min
    const activityDays =  7; // activity for 1 week

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

function calculateHostScore(ip, hostactivity, callback, score) {            // the function recieves the host's activity in array form

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

export { node, getPeers, initHost,initDHT, initFileDelivery,getPeerLatency,loadActivityPattern,createActivityPatternFile,trackActivityPattern, calculateHostAvailability, calculateMatching, calculateHostScore, sortHosts, shred_and_send, receive_and_gather };
