import { initHost,loadActivityPattern,createActivityPatternFile,trackActivityPattern } from '../app/utils/peer';

const myport = 1337;
const networkID = 'YEHIA_HESHAM_SAIDAUC';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '192.168.1.13', port: 2346 }
];

// createActivityPatternFile(()=>{
//   console.log('created');
// });

// loadActivityPattern((activity,error)=>{
//   if(error) { console.log('errror');}
//   else console.log(activity['last']);
//
// })

trackActivityPattern();
