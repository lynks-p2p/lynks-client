import { initDHT , initFileDelivery } from '../app/utils/peer';
import ip from 'ip';

const myIP = ip.address();
const myport = 2345;
const networkID = 'TEST_ON_YEHIA_HESHAM';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: myIP, port: 2345 }
];

initDHT( myIP, myport, networkID, seed, () => {

  initFileDelivery(myport, () => {

  console.log('DHT Node is running');
  console.log('identity is ' + node.identity.toString('hex'));

  });
});
