/* eslint-disable */
const basePath = '/home/chouaib/Lynks';

const pre_send_path = basePath + '/lynks-client/pre_send';
const pre_store_path = basePath + '/lynks-client/pre_store';
const downloadsDirPath = basePath + '/lynks-client/Downloads';
const storageDirPath = basePath + '/lynks-client/Storage';

const fileMapPath = basePath + '/lynks-client/systemFiles/filemap.json';
const statePath = basePath + '/lynks-client/systemFiles/state.json';

const activityPath = basePath + '/lynks-client/systemFiles/ActivityPattern.json';
const deltaMinutes =  10; // update activity every 10 min
const activityDays =  7; // activity for 1 week
const activityParts = 1008;

const NShreds = 10;
const parity = 2;

const uploadMessage = 'Stored & Secured';
const nowIndex = 700;
const minStorageSlider = 0;
const maxStorageSlider = Math.pow(10, 6);
const powerStorageSlider = 12;

export {
  statePath,
  fileMapPath,
  storageDirPath,
  downloadsDirPath,
  pre_store_path,
  pre_send_path,
  NShreds,
  parity,
  powerStorageSlider,
  maxStorageSlider,
  minStorageSlider,
  nowIndex,
  activityPath,
  activityParts,
  activityDays,
  deltaMinutes,
  uploadMessage
}
