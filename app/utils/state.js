/* eslint-disable */
import fs from 'fs';
import { readFileMap, storeFileMap } from './file';

export const fileMapPath = '/home/chouaib/Lynks/lynks-client/systemFiles/filemap.json';
export const activityPath = '/home/chouaib/Lynks/lynks-client/ActivityPatterns.txt';
export const key = 'FOOxxBAR';
export const NShreds = 10;
export const parity = 2;
var targets = 0;
export const uploadMessage = 'Stored & Secured';
export const activityParts = 1008;
export const nowIndex = 700;

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

export function loadActivityPattern(type) { // asynchronouslly loads the Activity Pattern
  const hourlyPatterns = [];
  const hourlyLabels = [];
  const f = fs.readFileSync(activityPath);
  const patterns = f.toString().split(',');
  let sum = 0;
  for (var i=0; i<patterns.length; i++){
    sum +=parseInt(patterns[i]);
    if(i%6==0){
      hourlyPatterns.push(sum);
      sum = 0;
    }
  }
  if (type=='data'){
    return hourlyPatterns;
  } else if (type=='labels'){
    for (var i=0; i<hourlyPatterns.length; i++){
      hourlyLabels.push('');
    }
    return hourlyLabels;
  }
}
