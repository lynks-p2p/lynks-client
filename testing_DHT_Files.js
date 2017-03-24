import { generateShredID, saveHost, retrieveHosts } from './app/utils/shred';
import { getPeers, sendShred, receiveShred,intializeDHT, node } from './app/utils/peer';


const myIP='10.40.115.1'
const myPort=1337
const myID='YEHIA_HESHAM_SAIDAUC'
const shredID='01234567890123456789'
// const key =Buffer.from(shredID).toString('hex')
// const key = generateShredID();
const hostID='YEHIA - ADEL TESTING '



//the server
const seed = [
  Buffer.from('YEHIA_HESHAM_SAIDAUC').toString('hex'),
  { hostname: '10.40.115.1', port: 1337 }
];



//the user
intializeDHT(myIP,myPort,myID,seed, () => {

  generateShredID((key) => {

      console.log('Key is '+key);

      saveHost(key,hostID, (err,numOfStored) =>{
        console.log('Total nodes who stored the pair is ' + numOfStored);
        console.log('-------------------')
        // console.log(`Connected to ${node.router.length} peers!`)
        // console.log(node.router)

      retrieveHosts(key, (value, contacts) => {

      	console.log('value is : '+value['value']);
        // console.log(value);
      	console.log('contacts are : ')
        console.log(contacts);
      	console.log('-------------------')
        // console.log(`Connected to ${node.router.length} peers!`)
        // console.log(node.router)

          });
        });
    });
});
