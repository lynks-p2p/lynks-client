
import io from 'socket.io';
import dl from 'delivery';
import fs from 'fs';


function getPeers() {
  // get list of n best peers


  return 0;
}

function sendShred() {
  // send shred to specific host

  return 0;
}

function receiveShred() {
  // open channel/socket to receive a shred

  // 5001 could be any random port else given that kadmelia gives the sender that random port
  const listener = io.listen(5001);

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

export { getPeers, sendShred, receiveShred };
