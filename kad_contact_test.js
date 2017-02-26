const kad = require('kad');

const seed = {
  address: '127.0.0.1',//'127.0.0.1',//10.40.44.118
  port: 1338
};

const dht = new kad.Node({
  transport: kad.transports.TCP(kad.contacts.AddressPortContact({
    address: '10.40.44.118 ',//'127.0.0.1', //10.40.44.118
    port: 1337
  })),
  storage: kad.storage.FS('./kad/')
});

dht.connect(seed, (err) => {
  if (err) console.log(err);
  // dht.get(key, callback);
  // dht.put(key, value, callback);
  console.log('Found  a !!!!!!!!!!!!!!');
  console.log(dht._router._buckets['159']._contacts[0]); //159 is the key in  buckets
  console.log('CLIENT!!!!!!!!!!!!!!');
});
