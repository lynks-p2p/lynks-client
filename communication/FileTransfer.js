var i=0,j=0;
module.exports = {
  listen_file : function  (socket, filenames, filepaths){
    socket.on('connect', function(){
      socket.emit('file_request', { filenames: filenames,  filepaths: filepaths });
      socket.on('start_receiving', function (data) {
        console.log ('now receiving!');
        var dl  = require('delivery');
        var fs = require('fs');
        var delivery = dl.listen(socket);
        delivery.on('receive.success',function(file){
          fs.writeFile(file.name, file.buffer, function(err){
            if(err){
              console.log('File could not be saved: ' + err);
             }else{
              console.log('File ' + i++ +file.name + " saved");
            }
          });
        });
      });
    });
  },
  send_file : function  (socket, filenames, filepaths, callback) {
    var dl  = require('delivery');
    var fs  = require('fs');

    socket.emit('start_receiving', { filenames: filenames }, {filepaths: filepaths});
    var delivery = dl.listen( socket );
    delivery.connect();

    delivery.on('delivery.connect',function(delivery){
      for (var i=0;i<filenames.length;i++){
        delivery.send({
          name: filenames[i],
          path : filepaths[i]
        });
      }
      delivery.on('send.success',function(file){
        console.log('File '+j++ +' sent successfully!');
        callback();
        });
      });
  }
};
