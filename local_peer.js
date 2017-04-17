import { generateShredID, saveHost, retrieveHosts } from './app/utils/shred';
import { getPeers, sendShred, receiveShred,initHost, node } from './app/utils/peer';
// const myIP='10.40.115.1'
const myPort=2345
const myID='TEST_ON_YEHIA_HESHAM'
// const hostID='AHMAD_HESHAM_SAIDAUC '
// const hostID2='James_SAIDAUC1234567'
//the server
const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.7.57.202', port: 2345 }
];

// const seed = [
//   Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
//   { hostname: '10.40.32.116', port: 2345 }
// ];


//the user
initHost(myPort,myID,seed, () => {
  console.log('DHT Node is running');
  console.log('identity is ' + node.identity.toString('hex'));

});
