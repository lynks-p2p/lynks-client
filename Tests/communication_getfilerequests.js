var handle_requests = require('../communication/client.js').handle_requests;

var private_port = 2345;

handle_requests(private_port, ()=>{});
