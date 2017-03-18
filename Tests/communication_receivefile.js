var handle_requests = require('../communication/server.js').handle_requests;
var map_port = require('../communication/PortForward.js').map_port;

var private_port = 12345;
var public_port = 12345;

map_port(private_port, public_port , (client) => {
handle_requests(private_port);
});
