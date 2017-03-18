var natUpnp = require('nat-upnp');
var net = require ("net");

module.exports = {
  map_port : function  (private_port, public_port, callback) {
    var client = natUpnp.createClient();
    client.portMapping({
      public: public_port,
      private: private_port,
      ttl: 1000
    }, function(err) {
      console.log('## done');
      console.log(err);
    });
client.getMappings(function(err, results) {

  console.log('-- get mappings');

console.log(results);
});
    return callback(client);
  },
  unmap_port : function  (client, public_port, callback) {
    client.portUnmapping({
      public: public_port
    });
    callback();
  }
};
