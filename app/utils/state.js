/* eslint-disable */
import fs from 'fs';
// import { fileMapPath } from './file';

export const fileMapPath = '/home/chouaib/Lynks/lynks-client/systemFiles/filemap.json';
export const key = 'FOOxxBAR';
export const NShreds = 10;
export const parity = 2;

export function readFilesInfo() {
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  const filesInfo = [];
  for(var key in fileMap) {
    if(fileMap.hasOwnProperty(key)) {
        filesInfo.push({
          name: fileMap[key].name,
          uploadTime: fileMap[key].uploadTime,
          size: `${fileMap[key].size/1000}KB`,
        });
    }
  }
  return filesInfo;
}
