import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import fs from 'fs';
import levelup from 'levelup';
import kad from 'kad';
import ip from 'ip'


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

function initHost( port, networkID, seed, callback) {
  initDHT( ip.address(), port, networkID, seed, () => {
    initFileDelivery(port, () => {
      callback();
    });
  });
}

function getPeers() {
  // get list of n best peers


  return 0;
}

export { node, getPeers, initHost, initDHT, initFileDelivery  };
