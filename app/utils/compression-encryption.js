var compress = require("./file").compress;
var decompress = require("./file").decompress;
var encrypt = require("./file").encrypt;
var decrypt = require("./file").decrypt;

var async = require('async');
var filename;
async.series
    ([
      /*  function (callback)
        {
            filename = compress("/home/james/Downloads/pic.jpg", callback);   //compress
        }
        ,
        function (callback)
        {
            filename = encrypt(filename,"abrakadabra",callback);  //encrypt
        }
        ,*/
       function (callback)
        {
            filename = decrypt("/home/james/Downloads/pic.jpg_encrypted","abrakadabra", callback);  //decrypt
        }
       ,
        function (callback)
        {
            filename = decompress(filename, callback);    //decompress
        }
    ]
    ,
    function(err)
    {

      console.log("finished asynchronously");
    });
    //compress("/home/james/Downloads/pic.jpg","/home/james/Downloads/pic2", callback);
// encrypt("/home/james/Downloads/pic2","abrakadabra");
//  decrypt("/home/james/Downloads/pic2","abrakadabra");
  // decompress("/home/james/Downloads/pic2","/home/james/Downloads/pic3")
