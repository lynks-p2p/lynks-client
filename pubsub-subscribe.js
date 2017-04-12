const quasar = require('kad-quasar');
import ip from 'ip'

import { initHost, node } from './app/utils/peer';

const myport = 8080;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: ip.address(), port: 8080 }
];

initHost(myport, networkID, seed, () => {

    node.plugin(quasar);

    node.quasarSubscribe('icanhost', (content) => {
      node.logger.info(content);
      console.log('Recieved published content');
    });

    console.log('Subscribed');

});
