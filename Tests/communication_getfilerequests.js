const handle_requests = require('../communication/client.js').handle_requests;

const private_port = 2345;

handle_requests(private_port, ()=>{});
