const dl  = require('delivery');
const fs = require('fs');
module.exports = {
  get_shreds : function  (socket, shredIDs, shredpath, callback){
    var shreds_received = 0;
    const delivery = dl.listen(socket);
    delivery.on('receive.success', function(shred) {
      fs.writeFile(shredpath + shred.name, shred.buffer, function(err) {
        if(err){
          console.log('shred could not be saved: ' + err);
         }else{
          console.log('shred ' + shred.name + ' saved');
        }
        shreds_received++;
        if (shreds_received == shredIDs.length ) {
          socket.disconnect();
          callback();
        }
      });
    });
    socket.on('disconnect', function() {
      console.log('socket closed');
    });
  },
  send_shreds : function  (socket, shredIDs, path, callback) {
    const delivery = dl.listen(socket);
    delivery.connect();
    delivery.on('delivery.connect', function(delivery){
      for (var i=0; i < shredIDs.length; i++) {
        delivery.send({
          name: shredIDs[i],
          path: path + shredIDs[i]
        });
      }
      delivery.on('send.success', function(shred) {
        console.log('A shred was sent successfully!');
      });
    });
    socket.on('disconnect', function() {
      console.log('socket closed');
      callback();
    });
  }
};
