const shred_and_send = require ('../app/utils/peer.js').shred_and_send;
const receive_and_gather = require ('../app/utils/peer.js').receive_and_gather;
const createFileMap = require ('../app/utils/file.js').createFileMap;
const public_ip = '127.0.0.1'; //testing locally for now

const public_port = 2345;   //testing locally for now
const filename = 'flash.jpg';
const filepath = '/home/cse492/Downloads/'
const key = 'adsadsdsakdshksadksdasddjsajdjsakjdshakdjsahdashdksahjd';
const NShreds = 10;
const parity = 2;
//createFileMap(() => {

// shred_and_send(public_ip, public_port, filename, filepath, key, NShreds, parity);
receive_and_gather (public_ip, public_port, 9, (error) => {
  if (!error)
  console.log ('nice');
  else console.log ('file no longer exists');
});
