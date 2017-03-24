import { createID, saveHost, retrieveHosts } from './app/utils/shred';
import { getPeers, sendShred, receiveShred,intializeDHT, node } from './app/utils/peer';


const myIP='10.40.115.1'
const myPort=1337
const myID='YEHIA_HESHAM_SAIDAUC'
const shredID='01234567890123456789'
const key =Buffer.from(shredID).toString('hex')
const hostID='YEHIA - ADEL TESTING '



//the server
const seed = [
  Buffer.from('YEHIA_HESHAM_SAIDAUC').toString('hex'),
  { hostname: '10.40.115.1', port: 1337 }
];



//the user
intializeDHT(myIP,myPort,myID,seed, () => {
  saveHost(node,key,hostID, (err,numOfStored) =>{

    console.log('Total nodes who stored the pair is ' + numOfStored);
    console.log(`Connected to ${node.router.length} peers!`)
    console.log(node.router)

  });
});






// retrieveHosts(node,key,(value, contacts)=>{
//
// 	console.log('value is : '+value);
// 	console.log('-------------------')
// 	console.log('contacts are :',contacts)
//   console.log(`Connected to ${node.router.length} peers!`)
//   console.log(node.router)
//
// });
