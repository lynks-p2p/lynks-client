import async from 'async'
import { sortHosts, calculateHostScore, loadActivityPattern } from './app/utils/peer';



// function sortHosts(hosts, callback) {
//
//     var asyncTasks = [];
//
//     hosts.forEach(function(host){
//         //var activity = host['activity'].toString().split(',');
//         asyncTasks.push(function(callback){
//             calculateHostScore(host['ip'], host['activity'], (score)=>{
//                 console.log(score);
//                 host['score']=score;
//                 callback();
//             });
//
//         });
//     });
//
//     async.parallel(asyncTasks, function(){
//         // console.log('All is done.');
//         // sorting should be done here
//
//         hosts.sort(function(a, b) {
//             return b['score'] - a['score'];
//         });
//         callback(hosts);
//     });
// }

var asyncTasks = [];

var hosts = [];

for (var x=0; x<10; x++)
{
    loadActivityPattern((hostactivity)=>{
        hosts.push({
            ip: '45.32.52.146',
            activity: hostactivity,
            score : -1
        });
    });
}

setTimeout(function() {
    sortHosts(hosts, (out)=>{
        console.log(out);
    })
}, 3000);



// sortHosts(hosts, (out)=>{
//     console.log(out);
// })

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


// items.forEach(function(item){
//   asyncTasks.push(function(callback){
//     console.log(item['num']);
//     callback();
//   });
// });
//
//
// async.parallel(asyncTasks, function(){
//   console.log('All is done.');
// });
