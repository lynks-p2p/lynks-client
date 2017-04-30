import { createFileMap, readFileMap, encryptFileMap, decryptFileMap, getRemoteFileMap, fileToBuffer } from './file';
import { generateFileMapKey, generateMasterKey}  from './keys_ids';
import SHA1 from 'crypto-js/sha1';
import crypto from 'crypto';
import request from 'request';
const fileMapPath = 'filemap.json';

var masterKey, userID, pin,fileMapKey;
var baseURL = 'http://10.40.47.118:4040/api/users/';

function signup(userName, pin, callback) { // sign up request to get unique userID from broker

  // do magic to check userID is unique with the server
    const userID = crypto.createHash('sha1').update(new Buffer(userName)).digest('hex');
    console.log('userID: ' + userID);
    baseURL += 'signup';
    setUserID(userID);
    createFileMap(()=>{
      generateFileMapKey(userID, pin, (fileMapKey) => {
        setFileMapKey(fileMapKey);
        encryptFileMap((fileMapBuffer)=>{
          console.log(fileMapBuffer);
            request.post(
              baseURL,
              { json:{username: userName, fileMap: fileMapBuffer }},
              (error, response, body) => {
                console.log(body);
                console.log(userID);
                //console.log(body);
                if (!error && response.statusCode == 200) {
                  console.log('Signup complete! Welcome '+userID);
                  return callback(userID, null);
                } else {console.log(body.message);return callback(null, error);}
              }
          );
      });
    });
  });
}


function login(userName, pin, callback) { // login request to get the fileMap from the broker
  baseURL += 'signin';
  const userID = crypto.createHash('sha1').update(new Buffer(userName)).digest('hex');
  request.post(
    baseURL,
    {json: {username: userName}},
     (error, response, body) => {
        if (!error && response.statusCode == 200) {
          setUserID(userID);
          setPin(pin);
          generateFileMapKey(userID, pin, (fileMapKey) => { //generate the fileMapKey
            console.log('\tfile map key generated!\t'+fileMapKey);
            setFileMapKey(fileMapKey);
              const brokerFileMap = new Buffer(body.fileMap);
              console.log('filemap: ' + brokerFileMap);
              // brokerFileMap = new Buffer(brokerFileMap);
              getRemoteFileMap(brokerFileMap, (updatedFileMap, error)=>{// generate the rest of keys using the remote fileMap
                if(error) {
                  console.log(error);
                  return callback(null, error);
                }
                console.log('filemap: ' + updatedFileMap);
                generateMasterKey(fileMapKey, updatedFileMap['rnd'], (mKey) => {
                  console.log('\tmaster key generated!\t'+mKey);
                  console.log('Authentication complete! Welcome back '+userID);
                  setMasterKey (mKey);
                  console.log('received user ID: ' + userID);
                  return callback(userID, null);
                });
              });
          });
            //console.log(body);
        } else {console.log(body.message);return callback(null, error);}
    }
  );
}

function setUserID (uID) { // Sets the userID
  userID = uID;
}

function setPin (uPin) { // Sets the user's pin
  return pin = uPin;
}

function setFileMapKey (filemapKey) { // Sets the MasterKey
  fileMapKey = filemapKey;
}

function setMasterKey (mKey) { // Sets the MasterKey
  masterKey = mKey;
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

export { login, signup, getUserID, getPin, getMasterKey,getFileMapKey, setUserID, setPin, setMasterKey };
