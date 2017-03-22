const send_shred_request = require ('../../communication/client.js').send_shred_request;
const send_store_request = require ('../../communication/client.js').send_store_request;
const processFile = require ('../../fileprocess2.js').processFile;

function getPeers() {
  // get list of n best peers


  return 0;
}

function shred_and_send(public_ip, public_port, filename, filepath) {
  processFile(filepath + filename,(shredIDs, path)=>{
    send_store_request(public_ip, public_port, shredIDs, path, ()=>{});
  });
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

export { getPeers, shred_and_send, receiveShred };
