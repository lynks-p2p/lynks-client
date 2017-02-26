const kad = require('kad');

const seed = {
  address: '127.0.0.1',
  port: 1338
};

const dht = new kad.Node({
  transport: kad.transports.TCP(kad.contacts.AddressPortContact({
    address: '10.40.33.163',
    port: 1337
  })),
  storage: kad.storage.FS('./kad/')
});

dht.connect(seed, (err) => {
  if (err) console.log(err);
  console.log(dht._router._buckets);
  // dht.get(key, callback);
  // dht.put(key, value, callback);
});
