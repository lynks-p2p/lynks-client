/* eslint-disable */
import fs from 'fs';
// import { fileMapPath } from './file';

const fileMapPath = '/home/chouaib/Lynks/lynks-client/filemap.js';

export function readFilesNames() {
  const fileMap = JSON.parse(fs.readFileSync(fileMapPath));
  const filesNames = [];
  for(var key in fileMap.files) {
    if(fileMap.files.hasOwnProperty(key)) {
        filesNames.push(fileMap.files[key].name);
    }
  }
  return filesNames;
}
