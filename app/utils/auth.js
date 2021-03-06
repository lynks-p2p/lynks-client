
/* eslint-disable */
import {
  createFileMap,
  readFileMap,
  encryptFileMap,
  decryptFileMap,
  getRemoteFileMap,
  fileToBuffer
} from './file';
import { generateFileMapKey, generateMasterKey}  from './keys_ids';
import crypto from 'crypto';
import request from 'request';
import { initHost, stopHost } from './peer';

var masterKey, userID, pin, fileMapKey, userName;

// Broker access point
import { brokerURL, myport, seed } from './ENV_variables';

function logoff(callback) {
  stopHost(callback);
}

function signup(userName, pin, callback) { // sign up request to get unique userID from broker

  // do magic to check userID is unique with the server
    const userID = crypto.createHash('sha1').update(new Buffer(userName)).digest('hex');
    console.log('userID: ' + userID);
    const requestURL = brokerURL + 'signup';
    setUserID(userID);
    setUserName(userName);
    createFileMap(()=>{
      generateFileMapKey(userID, pin, (fileMapKey) => {
        setFileMapKey(fileMapKey);
        encryptFileMap((fileMapBuffer)=>{
          console.log(fileMapBuffer);
            request.post(
              requestURL,
              { json:{username: userName, fileMap: fileMapBuffer }},
              (error, response, body) => {
                console.log(body);
                console.log(userID);
                //console.log(body);
                if (!error && response.statusCode == 200) {
                  console.log('Signup complete! Welcome '+userID);
                  return callback(userID, null);
                } else {
                  if (response.body.message == 'User already exists')return callback(null,'Username already exists!');
                  else return callback(null,'Problem reaching server!');
                }
              }
          );
      });
    });
  });
}


function login(userName, pin, callback) { // login request to get the fileMap from the broker
  console.log('Authenticating ...');
  const requestURL = brokerURL + 'signin';
  const userID = crypto.createHash('sha1').update(new Buffer(userName)).digest('hex');
  request.post(
    requestURL,
    {json: {username: userName}},
     (error, response, body) => {
        if (!error && response.statusCode == 200) {
          setUserName(userName);
          setUserID(userID);
          setPin(pin);
          generateFileMapKey(userID, pin, (fileMapKey) => { //generate the fileMapKey
            //.log('\tfile map key generated!\t'+fileMapKey);
            setFileMapKey(fileMapKey);
              const brokerFileMap = new Buffer(body.fileMap);
              //console.log('filemap: ' + brokerFileMap);
              // brokerFileMap = new Buffer(brokerFileMap);
              getRemoteFileMap(brokerFileMap, (updatedFileMap, error)=>{// generate the rest of keys using the remote fileMap
                if(error) {
                  console.log(error);
                  return callback(null, error);
                }
                //console.log('filemap: ' + updatedFileMap);
                generateMasterKey(fileMapKey, updatedFileMap['rnd'], (mKey) => {
                //  console.log('\tmaster key generated!\t'+mKey);
                  console.log('Authentication complete! Welcome back '+userID);
                  setMasterKey (mKey);
                  //console.log('received user ID: ' + userID);
                  initHost(myport, userID, seed, () => {
                    console.log('====== Host Initialized Successfuly =======');
                    return callback(userID, null);
                  });
                });
              });
          });
            //console.log(body);
        } else {
          if (response.body.message == 'User does not exist')return callback(null,'Username does not exist!');
          else return callback(null,'Problem reaching server!');
        }
    }
  );
}

function setUserName (uName) { // Sets the userID
  userName = uName;
}

function setUserID (uID) { // Sets the userID
  userID = uID;
}

function setPin (uPin) { // Sets the user's pin
   pin = uPin;
}

function setFileMapKey (filemapKey) { // Sets the MasterKey
  fileMapKey = filemapKey;
}

function setMasterKey (mKey) { // Sets the MasterKey
  masterKey = mKey;
}

function getUserName () { // Sets the userID
  return userName;
}
function getUserID () { // get the userID
  return userID;
}

function getPin () { // gets the user's pincode supplied at login
  return pin;
}

function getMasterKey () { // gets the MasterKey
  return masterKey;
}

function getFileMapKey () { // gets the MasterKey
  return fileMapKey;
}

export {
  login,
  signup,
  logoff,
  getUserID,
  getPin,
  getMasterKey,
  getFileMapKey,
  setUserID,
  setPin,
  setMasterKey,
  setUserName,
  getUserName
};
