/**
 * @example kad/example/minimal
 */

'use strict';

// Import dependencies
const levelup = require('levelup');
const kad = require('kad');

// Construct a kademlia node interface; the returned `Node` object exposes:
// - router
// - rpc
// - storage
// - identity
const node = kad({
  transport: new kad.HTTPTransport(),
  storage: levelup('./DHT_Storage/'),
  contact: { hostname: '10.40.57.60', port: 1338 },
  identity: Buffer.from('MANSOURKHEFFACHEWINZ')
});


node.use((request, response, next) => {
  console.log('\n---------------------------------------------------------')
  console.log('## REQ')
  console.log(request)
  console.log('## RES')
  console.log(response)
  console.log('---------------------------------------------------------\n')

  next();
});


// When you are ready, start listening for messages and join the network
// The Node#listen method takes different arguments based on the transport
// adapter being used
node.listen(1338, () => {
  node.join([Buffer.from('MANSOURKHEFFACHEWINZ').toString('hex'), {
    hostname: '10.40.57.60',
    port: 1338
  }], () => {});
});

// Listen for the 'join' event which indicates peers were discovered and
// our node is now connected to the overlay network
node.on('join', () => {
  console.log(`Connected to ${node.router.length} peers!`)

  console.log(node.router)
  console.log('ID: ' + node.router.identity.toString('hex'))

  // Base protocol exposes:
  // * node.iterativeFindNode(key, callback)
  // * node.iterativeFindValue(key, callback)
  // * node.iterativeStore(key, value, callback)

  const key = Buffer.from('CANTBELIEVETHISIS20!').toString('hex')

  node.iterativeStore(key, 'YUP.', (err, stored) => {
  	if (err) return console.log(err);

  	console.log('Stored on ' + stored);

  	// node.iterativeFindValue(key, (err2, value, contacts) => {
  	// 	if (err2) return console.log(err2);

  	// 	console.log(value);

  	// 	console.log('-------------------')
  	// 	console.log(contacts)

  	// })

  })
});