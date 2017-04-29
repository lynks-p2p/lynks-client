/* eslint-disable */
import fs from 'fs';
import { readFileMap, storeFileMap } from './file';

export const fileMapPath = '/home/chouaib/Lynks/lynks-client/systemFiles/filemap.json';
export const key = 'FOOxxBAR';
export const NShreds = 10;
export const parity = 2;
var targets = 0;
export const uploadMessage = 'Stored & Secured';

export function readFilesInfo() {
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  const filesInfo = [];
  for(var key in fileMap) {
    if(fileMap.hasOwnProperty(key)) {
        filesInfo.push({
          id: key,
          shreds: fileMap[key].shreds,
          name: fileMap[key].name,
          status: 1,
          uploadTime: fileMap[key].uploadTime,
          size: `${fileMap[key].size/1000}KB`,
        });
    }
  }
  return filesInfo;
}

// export function markFileDownloaded(fileID, callback){
//   readFileMap((fileMap) => {
//     fileMap[fileID].status  = 'downloaded';
//     storeFileMap(fileMap, () => {
//       callback();
//     });
//   });
// }
