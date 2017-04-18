/* eslint-disable */
import fs from 'fs';
// import { fileMapPath } from './file';

export const fileMapPath = '/home/chouaib/Lynks/lynks-client/systemFiles/filemap.json';
export const key = 'FOOxxBAR';
export const NShreds = 10;
export const parity = 2;

export function readFilesNames() {
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  const filesNames = [];
  for(var key in fileMap) {
    if(fileMap.hasOwnProperty(key)) {
        filesNames.push(fileMap[key].name);
    }
  }
  return filesNames;
}
