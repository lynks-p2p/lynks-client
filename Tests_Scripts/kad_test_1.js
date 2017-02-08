var kad = require('kad');
var traverse = require('kad-traverse');

var seed = {
  address: '127.0.0.1',
  port: 1348
};

// Create your contact
var contact = kad.contacts.AddressPortContact({
  address: '127.0.0.0',
  port: 1337
});

// Decorate your transport
var NatTransport = traverse.TransportDecorator(kad.transports.UDP);

// Create your transport with options
var transport = new NatTransport(contact, {
  traverse: {
    upnp: { forward:5000, ttl:0 },
    stun: { /* options */ },
    turn: { /* options */ }
  }
});

var dht = new kad.Node({
  transport: transport,
  storage: kad.storage.FS('/home/yehia/Desktop/datadir')
});

dht.connect(seed,  function(err){
  // dht.get(key, callback);
  // dht.put(key, value, callback);

});

transport.before('receive', function(message, contact, next) {
  // exit middleware stack if contact is blacklisted
  console.log("receive from another Node");
  console.log(message);

  // otherwise pass on
  next();
});
