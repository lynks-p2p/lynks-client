import { initHost,node } from '../app/utils/peer';
import { upload,download,readFileMap } from '../app/utils/file';
import { signup,login } from '../app/utils/auth'

const myport = 1337;
const userName = 'YEHIAa';
const pin = '12345';

const seed = [
  Buffer.from('ISTHISEVENABROKERYO?').toString('hex'),
  { hostname: '192.168.1.6', port: 8080 } //10.7.57.202
];
// console.log(require('buffer').kMaxLength);
signup(userName, pin, (userID) => {
  login(userName, pin, (userID, err)=>{
    //if(err){  return console.error(err);  }
    initHost(myport, userID, seed, () => {

      console.log('\tidentity is ' + node.router.identity.toString('hex'));
      console.log('==================> Initiating Upload <==================');

      upload('C:\\Users\\jawes\\Documents\\Study\\Thesis 2\\lynks-client\\Downloads\\flash.jpg', (err)=>{
        if(err) console.log('upload Failed ! '+err);
        else console.log('Upload Complete !');
      });
    });
  });
});
