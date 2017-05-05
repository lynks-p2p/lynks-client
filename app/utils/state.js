/* eslint-disable */
import fs from 'fs';
import _ from 'underscore';
import { readFileMap, storeFileMap } from './file';
import getSize from 'get-folder-size';

const fileMapPath = '/home/chouaib/Lynks/lynks-client/systemFiles/filemap.json';
const activityPath = '/home/chouaib/Lynks/lynks-client/ActivityPatterns.txt';
const storageDirPath = '/home/chouaib/Lynks/lynks-client/pre_store';
const statePath = '/home/chouaib/Lynks/lynks-client/systemFiles/state.json';

export const key = 'FOOxxBAR';
export const NShreds = 10;
export const parity = 2;
var targets = 0;

const uploadMessage = 'Stored & Secured';
const activityParts = 1008;
const nowIndex = 700;
const minStorageSlider = 0;
const maxStorageSlider = Math.pow(10, 6);
const powerStorageSlider = 12;

function readFilesInfo() {
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
          size: fileMap[key].size/1024,
        });
    }
  }
  return filesInfo;
}

function loadActivityPattern(type) { // asynchronouslly loads the Activity Pattern
  const hourlyPatterns = [];
  const averagePatterns = [];
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
  } else if (type=='average'){
    for (var i=0; i<hourlyPatterns.length; i++){
      averagePatterns.push(3);
    }
    return averagePatterns;
  }
}

function getStorageSpace(){
  const state = JSON.parse(fs.readFileSync(statePath));
  if(state.hasOwnProperty('storage')) {
    return state.storage;
  } else {
    console.error('Error reading storage field in ' + statePath);
  }
}

function getUsedSpace(){
  let usedSpace = 0;
  fs.readdirSync(storageDirPath).map((fileName)=>{
    usedSpace+=fs.statSync(storageDirPath+'/'+fileName).size;
  })
  return usedSpace/1024/1024;
}

function getStorageInfo(){

  const empty = getStorageSpace() - getUsedSpace();
  const used = getUsedSpace();

  return [empty,used]
}

function transform(value) {
  return Math.round((Math.exp(powerStorageSlider * value / maxStorageSlider) - 1) / (Math.exp(powerStorageSlider) - 1) * maxStorageSlider);
}

function reverse(value) {
  return (1 / powerStorageSlider) * Math.log(((Math.exp(powerStorageSlider) - 1) * value / maxStorageSlider) + 1) * maxStorageSlider;
}

function editStorage(newStorage){
  const state = JSON.parse(fs.readFileSync(statePath));
  state.storage = newStorage;
  fs.writeFileSync(statePath, JSON.stringify(state));
}

export {
  editStorage,
  reverse,
  transform,
  getStorageInfo,
  getUsedSpace,
  getStorageSpace,
  loadActivityPattern,
  readFilesInfo,
  powerStorageSlider,
  maxStorageSlider,
  minStorageSlider,
  nowIndex,
  activityParts,
  uploadMessage,
  statePath,
  storageDirPath,
  activityPath,
  fileMapPath
};
