
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
    setValues(operationID,data,shredname,shredpath){
      super.setValues(operationID,data);
      this.shredname=shredname;
      this.shredpath=shredpath;
    }
    deserialize (buf) {
        var msg = JSON.parse(buf);
        super.deserialize(buf);
        this.shredname = msg.shredname;
        this.shredpath = msg.shredpath;
    }
  }
module.exports =  {Message,fileMessage};
