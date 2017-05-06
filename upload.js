import { initHost,node } from './app/utils/peer';
import { upload,download,readFileMap } from './app/utils/file';
import { signup,login } from './app/utils/auth'

const myport = 1337;
const user_ID = 'YEHIA_HESHAM_SAIDAUC';
const pin = '12345';

const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '10.40.47.118', port: 8080 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
signup(user_ID, (userID) => {
  login(userID, pin, (err)=>{
    if(err){  return console.error(err);  }
    initHost(myport, userID, seed, () => {

      console.log('\tidentity is ' + node.router.identity.toString('hex'));
      console.log('initiating Upload .......');

      upload('/Users/ahmadadel/Desktop/Github/lynks-client/erb-logo.png', (err)=>{
        if(err) console.log('upload Failed ! '+err);
        else console.log('upload Complete !');
      });

    });
  });
});
