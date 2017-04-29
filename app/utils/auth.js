import { readFileMap } from './file';
import { generateFileMapKey, generateMasterKey}  from './keys_ids';

var masterKey, userID, pin;


function signup(userID, callback) { // sign up request to get unique userID from broker

  // do magic to check userID is unique with the server

  setUserID(userID);
  console.log('Signup complete! Welcome '+userID);
  return callback (userID);
}

function login(userID, pin, callback) { // login request

  // magic here to check if userID and pin exist in the broker database here

  //  user's inputs
  setUserID(userID);
  setPin(pin);

  generateFileMapKey(userID, pin, (fileMapKey) => {

    console.log('\tfile map key generated!\t'+fileMapKey);
    //decrypt the filemap
    readFileMap( ()=>{

      const random = Buffer.alloc(4); // fixed
      generateMasterKey(fileMapKey, random, (mKey) => {

        console.log('\tmaster key generated!\t'+mKey);
        setMasterKey (mKey);

        console.log('Authentication complete! Welcome back '+userID);
        callback();

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

export { login, signup, getUserID, getPin, getMasterKey, setUserID, setPin, setMasterKey };
