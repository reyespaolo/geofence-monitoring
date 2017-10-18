const express = require('express');
const Geofence = require('./geofence/index.js');
let app = express();

const mongoose = require('mongoose')
const Mongoose = mongoose.Mongoose
Mongoose.Promise = global.Promise
const dbURL = ''
let existingMongoose = new Mongoose().connect(dbURL, { useMongoClient: true })

const geofence = Geofence.initialize({
  existingMongoose: existingMongoose
});
// const geofence = Geofence.initialize({
//   dbURL: dbURL,
//   collection: 'geofences'
// });

geofence.start();

geofence.on('ready', (status) => {
  console.log(status)
  let geofenceObj = {
  	longitude: 121.084943,
  	latitude: 14.547430,
  	query: {
  		company: '59e6d0105382dc4192c11d19'
  	}
  }
  geofence.lookUpGeofence(geofenceObj, (err, result) => {
  	console.log(err, result)
  });
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