
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
class fileMessage extends Message {   //inherits from message
    constructor()
    {
      super();
      this.filename="";
      this.filepath="";
    }
    setValues(operationID,data,filename,filepath){
      super.setValues(operationID,data);
      this.filename=filename;
      this.filepath=filepath;
    }
    deserialize (buf) {
        var msg = JSON.parse(buf);
        this.operationID = msg.operationID;
        this.data = msg.data;
        this.filename = msg.filename;
        this.filepath = msg.filepath;
    }
  }
module.exports =  {Message,fileMessage};
