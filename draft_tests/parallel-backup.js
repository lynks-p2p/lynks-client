import async from 'async'


function sortHosts(hosts, callback) {

    var asyncTasks = [];

    hosts.forEach(function(host){
      asyncTasks.push(function(callback){
        console.log(item['num']);



        callback();
      });
    });

    async.parallel(asyncTasks, function(){
      // All tasks are done now
      console.log('All is done.');
    });
}

var asyncTasks = [];

var items = [];

for (var x=0; x<10; x++)
{
    items.push({
        name: 'ahmad',
        num: x
    })
}

// Loop through some items
// async.eachOf(items,
//
//     (item, index, asyncCallback)=>{
//         console.log(item['num']);
//         //asyncCallback();
//     },
//
//     (err) => {
//       if(err)  {  console.log('error in calculating scores'); asyncCallback(err); }
//       console.log('All is done');
//     }
// );


items.forEach(function(item){
  asyncTasks.push(function(callback){
    console.log(item['num']);
    callback();
  });
});


async.parallel(asyncTasks, function(){
  // All tasks are done now
  console.log('All is done.');
});
