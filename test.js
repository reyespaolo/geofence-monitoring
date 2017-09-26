const express = require('express');
const GeoFence = require('./geofence/index.js');
let app = express();

const geofence = GeoFence.initialize({
  'dbURL' : 'mongodb://localhost:27017/logixbusinesssolutions',
  'collection': 'geofences'
});
geofence.start();

geofence.on('ready', (status) => {
  geofence.lookUp( 121.00158333778381,14.6328616393338, (result) => {
    console.log(result)
  })

})


let server = app.listen(3030);
