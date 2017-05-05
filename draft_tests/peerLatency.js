import { initHost , getPeerLatency } from '../app/utils/peer';
import ip from 'ip';
const publicIp = require("public-ip");


const myport = 2345;
const networkID = 'YEHIA_HESHAM_SAIDAUC';
const myIP= ip.address();
const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: myIP, port: 2346 }
];

initHost( myport, networkID, seed, () => {
  publicIp.v4().then(public_ip => {
    var ip=	'8.8.8.8' // google
    // ip ='131.107.0.89' //Microsoft
    // ip='213.181.226.205' // AUC LAN
    // ip='213.181.229.70' // AUC WIFI
    // ip= myIP
    // ip = public_ip
    // ip='105.198.225.72'
    // ip='139.130.4.5'
    getPeerLatency(ip,(peerInfo)=>{
      if(peerInfo['alive'])
       {
        console.log(ip+ ' is Online');
        console.log('Avg latency is '+peerInfo['avg']);
      } else console.log(ip+ 'is Offline');

    });
  });
});
