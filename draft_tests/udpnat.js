var stun = require('vs-stun');



var socket, server = { host: 'stun.l.google.com', port: 19302 }



var bestSock = require('dgram').createSocket('udp4')



bestSock.on('message', (message, remote) => {

    console.log('### ' + remote.address + ':' + remote.port +' - ' + message);



    // send message back

    bestSock.send(message, remote.port, remote.address)

});



var callback = ( error, value ) => {

  if ( !error ) {

    socket = value;



    socket.stun = socket;



    console.log(socket.stun);



  }

  else console.log('Something went wrong: ' + error);

}



var natUpnp = require('nat-upnp');

var net = require ("net");

var client = natUpnp.createClient();

client.portMapping({

  public: 1245,

  private: 3001,

  ttl: 10000

}, function(err) {

  // Will be called once finished

  console.log('## done');

  console.log(err);

});

// client.portUnmapping({

//   public: 12345

// });

client.getMappings(function(err, results) {

  console.log('-- get mappings');

  console.log(results);

});



bestSock.bind(3001, () => {

	stun.resolve(bestSock, server, callback);

})
