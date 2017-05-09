
class Message {
  constructor () {
    this.operationID="";
    this.data="";
  }
    setValues(operationID,data){
      this.operationID = operationID;
      this.data = data;
    }
    serialize () {
        return JSON.stringify(this);
    }
    deserialize (buf) {
        var msg = JSON.parse(buf);
        this.operationID = msg.operationID;
        this.data = msg.data;
    }
}
class shredMessage extends Message {   //inherits from message
    constructor()
    {
      super();
      this.shredID="";
      this.shredpath="";
    }
    setValues(operationID,data,shredID,shredpath){
      super.setValues(operationID,data);
      this.shredID=shredID;
      this.shredpath=shredpath;
    }
    deserialize (buf) {
        var msg = JSON.parse(buf);
        super.deserialize(buf);
        this.shredID = msg.shredID;
        this.shredpath = msg.shredpath;
    }
  }
module.exports =  {Message,shredMessage};
