import { initFileDelivery } from '../app/utils/peer';
import { storeShredRequest, getShredRequest} from '../app/utils/shred';

const myip = '127.0.0.1';
const myport = 1337;

initFileDelivery(1337, () => {
  storeShredRequest(myip, myport, 'flash.jpg', './Tests/', () => {
    getShredRequest(myip, myport, 'flash.jpg', './Downloads/', () => {
      console.log('HA JAMES');
    })
  });
});
