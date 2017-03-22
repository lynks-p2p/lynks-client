const kad = require('kad');

//the server
const seed = [
  'ea48d3f07a5241291ed0b4cab6483fa8b8fcc127',
  { hostname: '10.40.57.40', port: 5432 }
];


//we are using two port on each machine
const listeningPort=1337;
const SendingPort=5001;


const node = kad({
  transport: new kad.HTTPSTransport(),
  storage: require('levelup')('./DHT_Storage/'),
  contact: { hostname: 'YourIP', port: SendingPort }
});


node.listen(listeningPort);
node.join(seed, function() {
  console.log(`Connected to ${node.router.size} peers!`);
});
