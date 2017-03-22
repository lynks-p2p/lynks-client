const send_shred_request = require ('../communication/client.js').send_shred_request;
const send_store_request = require ('../communication/client.js').send_store_request;
//const shredFile = require ('../app/utils/file.js').shredFile;

const public_ips = '127.0.0.1'; //testing locally for now

const public_port = 2345;   //testing locally for now
const filename = 'flash.jpg';
const filepath = '/home/james/Downloads/'


//shredFile()

var shredIDs = [];

shredIDs.push(filename);
shredIDs.push(filename+'1');
shredIDs.push(filename+'2');



//send_shred_request(public_ips, public_port, shredIDs, ()=>{});
send_store_request(public_ips, public_port, shredIDs, filepath, ()=>{});
