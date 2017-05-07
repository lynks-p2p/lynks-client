/* eslint-disable */

import path from 'path';

const basePath = path.resolve('./') + '/';

const pre_send_path = basePath + 'pre_send/';
const pre_store_path = basePath + 'pre_store/';
const downloadsDirPath = basePath + 'Downloads';
const storageDirPath = basePath + 'Storage';

const fileMapPath = basePath + 'systemFiles/filemap.json';
const encryptedFileMapPath = basePath + 'systemFiles/encryptedfilemap';
const statePath = basePath + 'systemFiles/state.json';

const activityPatternPath = basePath + 'systemFiles/ActivityPattern.json';

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
  activityPatternPath,
  activityParts,
  activityDays,
  deltaMinutes,
  uploadMessage,
  encryptedFileMapPath
}
