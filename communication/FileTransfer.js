var i=0,j=0;
module.exports = {
  listen_file : function  (socket){
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
},
  send_file : function  (socket, file_name, file_path, callback) {
  var dl  = require('delivery'),fs  = require('fs');

    socket.on('connect', function(){
    socket.emit('file_request', { hello: 'world' });
    var delivery = dl.listen( socket );
    delivery.connect();

    delivery.on('delivery.connect',function(delivery){
//console.log('connectedd');
      delivery.send({
        name: file_name,
        path : file_path
      });

      delivery.on('send.success',function(file){
        console.log('File '+j++ +'sent successfully!');
        callback();
        });
      });
    });
  }
};
