// const isOnline = require('is-online');
//
// var activity= Array.apply(null, Array(20)).map(Number.prototype.valueOf,0);


var activity=""

var delta_minutes = (1/60), the_interval = delta_minutes * 60 * 1000;
//i<(7×24×60/delta_minutes)
for(var i=0;i<60;i++)
  activity+='0';

// isOnline().then(online => {
// 	console.log(online);
// 	//=> true
// });

console.log(activity.toString('2'));
// activity^=  (1 << (new Date().getSeconds()));
// console.log(activity);


// var date = new Date();
// var start = date.getSeconds();


setInterval(()=> {
  // console.log("I am doing my 5 minutes check");
  // var date = new Date();
  // console.log(date.getMinutes()+':'+date.getSeconds());
  // console.log('getSeconds '+new Date().getSeconds());
  // console.log('getMinutes '+new Date().getMinutes());
  // console.log(new Date().getSeconds());

 activity^=  (1 << (new Date().getSeconds()));
 console.log(activity);

  // do your stuff here
}, the_interval);
