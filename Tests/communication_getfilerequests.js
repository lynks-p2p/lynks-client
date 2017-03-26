const handle_requests = require('../communication/server.js').handle_requests;
const map_port = require('../communication/PortForward.js').map_port;
const publicIp = require("public-ip");
const private_ip = require("ip");

const private_port = 2345;
const public_port = 2345;   //testing locally for now

publicIp.v4().then(public_ip => {
  console.log("public ip: ", public_ip);
  console.log("private ip: ", private_ip.address());
  map_port(private_port, public_port , () => {
    handle_requests(private_port, () => {});
  });
});
