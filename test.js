const express = require('express');
const Geofence = require('./geofence/index.js');
let app = express();

const geofence = Geofence.initialize({
  'dbURL' : 'mongodb://gpsv6:intexpro!1@ds019843-a0.mlab.com:19843,ds019843-a1.mlab.com:19843/gpsv6?replicaSet=rs-ds019843',
  'collection': 'geofences'
});
geofence.start();

geofence.on('ready', (status) => {
  console.log(status)
  let geofenceObj = {
  	longitude: 121.0014771,
  	latitude: 14.6328143,
  	query: {
  		company: '59df6e5d3983f57c05655ddd'
  	}
  }
  geofence.lookUpGeofence(geofenceObj);
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
