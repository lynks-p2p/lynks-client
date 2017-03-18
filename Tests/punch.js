var natUpnp = require('nat-upnp');
var net = require ("net");

var client = natUpnp.createClient();

client.portMapping({

  public: 2345,

  private: 2345,

  ttl: 1000

}, function(err) {

  // Will be called once finished

  console.log('## done');

  console.log(err);

});



client.portUnmapping({

  public: 12345

});



client.getMappings(function(err, results) {

  console.log('-- get mappings');

  console.log(results);

  var io  = require('socket.io').listen(2345),
      dl  = require('delivery');

  var fs = require('fs');

  io.sockets.on('connection', function(socket){

        var delivery = dl.listen(socket);
        delivery.on('receive.success',function(file){

          fs.writeFile(file.name, file.buffer, function(err){
            if(err){
              console.log('File could not be saved: ' + err);
            }else{
              console.log('File ' + file.name + " saved");
            };
          });
        });
      });


});



// client.getMappings({ local: true }, function(err, results) {
//
//   console.log('-- get lcoal mappings');
//
//   console.log(results);
//
// });



// client.externalIp(function(err, ip) {
//
//   console.log('-- get ip');
//
//   console.log(ip);
//
// });
