import { createID, saveHost, retrieveHosts } from './app/utils/shred';
import { getPeers, sendShred, receiveShred,listenDHT,intializeDHT } from './app/utils/peer';



const myIP='10.40.115.1'
const myPort=1337
const myID='YEHIA_HESHAM_SAIDAUC'
const key =Buffer.from('CANTBELIEVETHISIS20!').toString('hex')
const shredID='12345'
const hostID='ABCDE'



//the server
const seed = [
  Buffer.from(myID).toString('hex'),
  { hostname: myIP, port: 1337 }
];


//the user
const node = intializeDHT(myIP,myPort,myID,seed)
// saveHost(node,key,shredID,hostID, (err,numOfStored) =>{
//
//   console.log('Total nodes who stored the pair is ' + numOfStored);
//   console.log(`Connected to ${node.router.length} peers!`)
//   console.log(node.router)
//
// });

node.use((request, response, next) => {
  console.log('\n---------------------------------------------------------')
  console.log('## REQ')
  console.log(request)
  console.log('## RES')
  console.log(response)
  console.log('---------------------------------------------------------\n')

  next();
});



retrieveHosts(node,key,(value, contacts)=>{

	console.log('value is : '+value);
	console.log('-------------------')
	console.log('contacts are :',contacts)
  console.log(`Connected to ${node.router.length} peers!`)
  console.log(node.router)

});
