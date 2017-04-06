import { initHost } from '../app/utils/peer';
import {upload } from '../app/utils/file';

const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.7.57.202', port: 2345 }
];

initHost(myport, networkID, seed, () => {

  upload('/home/yehia/Desktop/flash.jpg', ()=>{
    console.log('upload Complete !');
  });
});
