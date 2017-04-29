import { generateFileMapKey, generateMasterKey } from './file';

var masterKey, userID, pin;

function login(userID, pin, callback) {
  // login request
  // check if userID and pin exist in the broker database here
  setUserID(userID);
  setPin(pin);
  generateFileMapKey(userID, pin, (fileMapKey) => {
    console.log('file map key generated!');
    generateMasterKey(fileMapKey, (mKey) => {
      console.log('master key generated!');
      setMasterKey (mKey);
      console.log('authentication complete!');
    });
  });
  return callback ();
}

function signup(userID, pin, callback) {
  // sign up request
  // make sure that userID is not taken with broker here
  setUserID(userID);
  setPin(pin);
  generateFileMapKey(userID, pin, (fileMapKey) => {
    console.log('file map key generated!');
    generateMasterKey(fileMapKey, (mKey) => {
      console.log('master key generated!');
      setMasterKey (mKey);
      console.log('authentication complete!');
    });
  });
  return callback ();
}
function getUserID () {
  return userID;
}
function getPin () {
  return pin;
}
function getMasterKey () {
  return masterKey;
}
function setUserID (uID) {
  userID = uID;
}
function setPin (uPin) {
  return pin = uPin;
}
function setMasterKey (mKey) {
  masterKey = mKey;
}
export { login, signup, getUserID, getPin, getMasterKey, setUserID, setPin, setMasterKey };
