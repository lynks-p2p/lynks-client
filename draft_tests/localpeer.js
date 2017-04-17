import { initDHT , initFileDelivery } from '../app/utils/peer';

import ip from 'ip';

const myport = 2346;

const networkID = 'TEST_ON_YEHIA_HESHAM';

const myIP= ip.address();
console.log(myIP);
const seed = [

  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),

  { hostname: myIP, port: 2346 }

];

initDHT( myIP, myport, networkID, seed, () => {

  initFileDelivery(myport, () => {

    console.log('Local Peer running');

  });

});
