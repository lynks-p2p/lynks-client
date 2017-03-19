var kad = require('kad');
var traverse = require('kad-traverse');

// var seed = {
//   address: '127.0.0.1',
//   port: 1348
// };

// Create your contact
var contact = kad.contacts.AddressPortContact({
  address: '192.168.1.3',
  port: 1337
});

// Decorate your transport
var NatTransport = traverse.TransportDecorator(kad.transports.UDP);

// Create your transport with options
var transport = new NatTransport(contact, {
  traverse: {
    upnp: false,
    stun: { /* options */ },
    turn: { /* options */ }
  }
});

const node = kad({
  transport: new kad.HttpTransport(),
  storage: require('levelup')('/home/james/Downloads'),
  contact: { hostname: '192.168.1.3', port: 8080 }
});

const seed = [
  'ea48d3f07a5241291ed0b4cab6483fa8b8fcc127',
  { hostname: '127.0.0.1', port: 8080 }
];

node.listen(1337);
node.join(seed, function() {
  console.log(`Connected to ${node.router.size} peers!`);
});

// var dht = new kad.Node({
//   transport: transport,
//   storage: kad.storage.FS('/home/james/Downloads')
// });
//
// dht.connect(seed,  function(err){
//   // dht.get(key, callback);
//   // dht.put(key, value, callback);
//
//
// });

transport.before('receive', function(message, contact, next) {
  // exit middleware stack if contact is blacklisted
  console.log("receive from another Node");
  console.log(message);

  // otherwise pass on
  next();
});
