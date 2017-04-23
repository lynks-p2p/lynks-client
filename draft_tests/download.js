import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';


const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '192.168.167.1', port: 2346 } //10.7.57.202
];

initHost(myport, networkID, seed, () => {
  console.log('identity is ' + node.router.identity.toString('hex'));

readFileMap((fileMap)=>{
  const fileMapSize = Object.keys(fileMap).length;
  const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
  download('2f4705695709092e7d34c366c3ab1399', (err)=>{
    if(err) console.log('download Failed ! '+err);
    else console.log('download Complete !');
    });
  });


});
