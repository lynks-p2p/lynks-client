import { initHost,node } from '../app/utils/peer';
import {upload,download,readFileMap } from '../app/utils/file';


const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.36.28', port: 2345 } //10.7.57.202
];

initHost(myport, networkID, seed, () => {
  console.log('identity is ' + node.router.identity.toString('hex'));

readFileMap((fileMap)=>{
  const fileMapSize = Object.keys(fileMap).length;
  const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
  const FileID=lastFileID;
  download(FileID, ()=>{
    console.log('download Complete !');
    });
  });


});
