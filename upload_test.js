import { upload, download } from './app/utils/file';

const PeerIP = '192.168.1.3';
const PeerPort = '2345';

const ency_key='LYNKS_CS-THESIS'
const myID='YEHIA_HESHAM_SAIDAUC'
const AbsoluteFilepath ='/home/yehia/Desktop/Downton_Abbey_Theme_on_Violin_Taryn_Harbridge.mp4'

//  the DHT seed
const seed = [
  Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'),
  { hostname: '192.168.1.2', port: 2345 }
];

const Peer_contacts = [];
const generateContacts= (callback) =>{

  for (let f = 0; f < 30; f++)
  {
    Peer_contacts.push({ ip: '192.168.1.3', port: 2345, id: Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex') })
  }

  callback(contacts)
}


generateContacts((contacts)=>{
  upload(myID, contacts, ency_key, seed, AbsoluteFilepath, () => {
    console.log('finished uploading');
  });
});

function upload(myID, contacts, encyKey, seed, AbsoluteFilepath, callback) {


  const filename= path.basename(AbsoluteFilepath)
  const filedirectory=path.dirname(AbsoluteFilepath)

  const myPort = 1337;
  const hostID = 'TEST_ON_YEHIA_HESHAM'; //  fixed
  const NShreds = 10;
  const parity = 2;

  //the user
  intializeDHT(myPort,myID,seed, () => {
    //sends shreds to a selected peers and update the local filemap

    //PeerIps should be a list of Ips supplied  by the Pub/Sub method. here it is a single IP
    // const contact = { ip: '192.168.1.2', port: 2345, id: Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex') };



    shred_and_send(contacts, filename, filedirectory+'/', encyKey, NShreds, parity, () => {


      //  update  DHT with the shred-host pairs
      readFileMap((fileMap)=>{
          const fileMapSize = Object.keys(fileMap).length;
          const lastFileID = [Object.keys(fileMap)[fileMapSize-1]]; //fixed , since this will not be numbers, instead will be a filekey
          const file = fileMap[lastFileID];
          const { shreds: shredIDs, key, deadbytes, NShreds, parity } = file;

          let i=0
          const update_DHTLoop= (i, limit,callback2) =>{


            //hostID should be given by the
            saveHost(shredIDs[i], Buffer.from(hostID).toString('hex'), (err,numOfStored) =>{
              console.log('Shred_'+i+', was stored on total nodes of ' + numOfStored);
              if(i<limit)
              {
                  update_DHTLoop(i + 1, limit,callback2);

              } else {
                callback2();
              }
            });
          }

          update_DHTLoop(0, shredIDs.length-1,()=>{
            callback();
          });
        });
      });
    });
}

function download(myID, seed, big_callback){

  const myPort=1337
  const NShreds = 10;
  const parity = 2;
  let peerIDs=[]

  //the user
  intializeDHT(myPort,myID,seed, () => {
              const my_function= (fileMap,callback)=>{
                const fileMapSize = Object.keys(fileMap).length;
                const lastFileID = [Object.keys(fileMap)[fileMapSize-1]];
                console.log('File ID :'+lastFileID);
                const file = fileMap[lastFileID];
                callback(file,lastFileID);
              }

              let i=0
              const update_forloop= (shredIDs,i, limit,callback) =>{

                retrieveHosts(shredIDs[i], (value, contacts) =>{
              	if(i%3==0) console.log('shredID ' + shredIDs[i] + ' at host '+ value['value']);
                peerIDs.push(value);

                  if(i<limit)
                  {
                      update_forloop(shredIDs,i + 1, limit,callback);
                  }
                  else {
                    callback();
                  }

                });
              }

              readFileMap((fileMap)=>{
                my_function(fileMap,(file,lastFileID)=>{
                  const { shreds: shredIDs, key, deadbytes, NShreds, parity } = file;

                  update_forloop(shredIDs, 0, shredIDs.length-1, ()=>{

                    // let result= node.router.getContactByNodeId(Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'));
                    // console.log((peerIDs[0].value));
                    // console.log(Buffer.from('TEST_ON_YEHIA_HESHAM').toString('hex'))
                    // console.log(peerIDs[0]);

                    node.iterativeFindNode((peerIDs[0].publisher), (error, contact)=>{
                      if (error) console.log(error);
                      console.log('Now Receiving Shreds !!!!');
                      // console.log(contact);
                      // console.log(contact.value);

                      const hostIP = contact[0][1].hostname
                      const hostPort = contact[0][1].port

                      receive_and_gather(hostIP, hostPort, lastFileID, () => {
                          big_callback();
                      });
                    });
                  });
                });
              });
  });


 }
