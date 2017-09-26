const express = require('express');
const GeoFence = require('./geofence/index.js');
let app = express();

const geofence = GeoFence.initialize({
  'dbURL' : 'mongodb://localhost:27017/logixbusinesssolutions',
  'collection': 'geofences'
});
geofence.start();

geofence.on('ready', (status) => {
  console.log(status)
  geofence.lookUpGeofence(121.00158333778381,14.6328616393338);
  // geofence.lookUpGeofence(121.00158333778381,14.6328616393338, (geofenceResults) => {
  //   console.log(geofenceResults)
  // })

})

geofence.on('lookUpGeofence:results', (geofenceResults) => {
  geofence.arrangeGeofence(geofenceResults);
})

geofence.on('lookUpGeofence:error', (geofenceResultError) => {
  console.log(geofenceResultError)
})



let server = app.listen(3030);
