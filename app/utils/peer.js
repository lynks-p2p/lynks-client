
import socketio from 'socket.io';
import socketclient from 'socket.io-client';
import dl from 'delivery';
import fs from 'fs';
const levelup = require('levelup');
const kad = require('kad');


let node;

function intializeDHT(myIP, myPort, myID, mySeed, callback){
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
    contact: { hostname: myIP, port: myPort },
    identity: Buffer.from(myID)
  });

  // node.use((request, response, next) => {
  //   console.log('\n---------------------------------------------------------')
  //   console.log('## REQ')
  //   console.log(request)
  //   console.log('## RES')
  //   console.log(response)
  //   console.log('---------------------------------------------------------\n')
  //
  //   next();
  // });


  node.listen(myPort, () => {
    node.join(mySeed, () => {
      console.log('Successfuly connected to Seed '+mySeed[1]['hostname']+':'+mySeed[1]['port']);
      callback()
    })
  });

}

function getPeers() {
  // get list of n best peers


  return 0;
}


function sendShred(ip, port, filename, filepath) {
  const address = `http://${ip}:${port}`;
  const socket = socketclient(address);

  // send shred to specific host
  socket.on('connect', () => {
    const delivery = dl.listen(socket);

    delivery.connect();

    delivery.on('delivery.connect', (delivery2) => {
      delivery2.send({
        name: filename,
        path: filepath
      });
    });

    delivery.on('send.success', (file) => {
      console.log(`File: ${file} sent successfully!`);
    });
  });


  return 0;
}

function receiveShred() {
  // open channel/socket to receive a shred

  // 5001 could be any random port else given that kadmelia gives the sender that random port
  const listener = socketio.listen(5001);

  listener.sockets.on('connection', (socket) => {
    const delivery = dl.listen(socket);
    delivery.on('receive.success', (file) => {
      fs.writeFile(file.name, file.buffer, (err) => {
        if (err) {
          console.log('File could not be saved: ', err);
        } else {
          console.log('File ', file.name, ' saved');
        }
      });
    });
  });

  return 0;
}

export { node, getPeers, sendShred, receiveShred,intializeDHT };
