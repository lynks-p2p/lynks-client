import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';


const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.32.1', port: 2346 } //10.7.57.202
];

initHost(myport, networkID, seed, () => {
  console.log('identity is ' + node.router.identity.toString('hex'));
  upload('./draft_tests/flash.jpg', (err)=>{
    if (!err)
      console.log('upload Complete !');
    else console.log ('errrr');
  });
});
