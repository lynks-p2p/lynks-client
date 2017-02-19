//1. Can take operation ID and data as arguments respectively.
//2. Can take no arguments at all
//operation id lets the target node understand which operation it should execute

module.exports = function Message() {
  if(arguments.length==2){
     this.operationID = arguments[0];
     this.data = arguments[1];
   }
   else {
     this.data="";
     this.operationID="";
   }
    this.serialize = function() {
        return JSON.stringify(this);
    }
    this.deserialize = function(buf) {
        var msg = JSON.parse(buf);
        this.operationID = msg.operationID;
        this.data = msg.data;
    }
};
