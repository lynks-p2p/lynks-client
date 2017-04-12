//import { generateShredID, saveHost, retrieveHosts } from './app/utils/shred';
//import { getPeers, sendShred, receiveShred, intializeDHT } from './app/utils/peer';


//const kad = require('kad');
import kad from 'kad';
import levelup from 'levelup';
const quasar = require('kad-quasar');

//const node = kad({ /* options */ });
const node = kad({
  transport: new kad.UDPTransport(),
  //storage: levelup('./DHT_Storage/'),
  contact: { hostname: '10.40.32.27' , port: 80808 },
  identity: Buffer.from('YEHIA_HESHAM_SAIDAUC')
});

node.plugin(quasar);

var content = 'Sup dudes?'

node.quasarSubscribe('topic string', (content) => {
  node.logger.info(content);
  console.log('SUPPPPPP');
});

console.log('Subscribed');

// const myIP='10.40.115.1'
// const myPort=2345
// const myID='TEST_ON_YEHIA_HESHAM'
// // const hostID='AHMAD_HESHAM_SAIDAUC '
// // const hostID2='James_SAIDAUC1234567'
// //the server
// const seed = [
//   Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
//   { hostname: '10.40.35.49', port: 2345 }
// ];
// //the user
// intializeDHT(myPort,myID,seed, () => {
//   console.log('DHT Node is running');
//
// });
