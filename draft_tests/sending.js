var socket  = require('socket.io-client')('http://'+ '127.0.0.1' +':2345'),
  dl  = require('delivery'),
  fs  = require('fs');
//
// var socket = io.connect('http://'+ '10.40.60.243' +':5001');

socket.on('connect', function(){
  var delivery = dl.listen( socket );

  delivery.connect();

  delivery.on('delivery.connect',function(delivery){
    for (var i=0;i<10;i++)
    {
    delivery.send({
      name: 'flash.jpg',
      path : './flash.jpg'
    });
}
    delivery.on('send.success',function(file){
      console.log('File sent successfully!');
    });
  });

});
