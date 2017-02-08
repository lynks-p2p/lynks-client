var kad = require('kad');

var seed = {
  address: '127.0.0.1',
  port: 1348
};

var tran = new kad.transports.HTTP(kad.contacts.AddressPortContact({
  address: '10.40.60.243',
  port: 1337
}));

var dht = new kad.Node({
  transport: tran,
  storage: kad.storage.FS('/home/yehia/Desktop/datadir')
});

dht.connect(seed,  function(err){
  // dht.get(key, callback);
  // dht.put(key, value, callback);

});

tran.before('receive', function(message, contact, next) {
  // exit middleware stack if contact is blacklisted
  console.log("receive from another Node");
  console.log(message);

  // otherwise pass on
  next();
});
