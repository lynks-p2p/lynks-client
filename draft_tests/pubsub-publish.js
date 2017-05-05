const quasar = require('kad-quasar');
import ip from 'ip'

import { initHost, node } from './app/utils/peer';

const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: ip.address(), port: 8080 }            // change into seed's id
];

initHost(myport, networkID, seed, () => {

    node.plugin(quasar);

    var content = 'Sup dudes?'

    node.quasarPublish('icanhost', {
      hey: content
    });

    console.log('Published');
});
