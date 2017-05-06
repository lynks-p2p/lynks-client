/* eslint-disable */

import { readFileMap,encryptFileMap,decryptFileMap, getFileMap } from './file';
import { generateFileMapKey, generateMasterKey}  from './keys_ids';

var masterKey, userID, pin,fileMapKey;


function signup(userID, callback) { // sign up request to get unique userID from broker

  // do magic to check userID is unique with the server

  setUserID(userID);
  console.log('Signup complete! Welcome '+userID);
  return callback (userID);
}

function login(userID, pin, callback) { // login request to get the fileMap from the broker

  console.log('Authenticating ...');
  //  user's inputs
  setUserID(userID);
  setPin(pin);

  generateFileMapKey(userID, pin, (fileMapKey) => { //generate the fileMapKey
    // console.log('\tfile map key generated!\t'+fileMapKey);
    setFileMapKey(fileMapKey);

    getFileMap((fileMap,error)=>{// generate the rest of keys using the remote fileMap
      if(error) { return callback(error); }

      generateMasterKey(fileMapKey, fileMap['rnd'], (mKey) => {

        // console.log('\tmaster key generated!\t'+mKey);
        console.log('\tAuthentication Complete! Welcome back '+userID);

        setMasterKey (mKey);
        callback(null);

      });
    });
  });
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

export { login, signup, getUserID, getPin, getMasterKey, getFileMapKey, setFileMapKey, setUserID, setPin, setMasterKey };
