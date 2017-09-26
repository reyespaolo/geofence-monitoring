'use strict';
let EventEmitter = require('events').EventEmitter;
let mongoose = require('mongoose');
var geofence = require('./geofence.model.js');
let util = require('util');
const _ = require('lodash');
mongoose.Promise = global.Promise;

var requiredOptions = [
    'dbURL',
];

function geocacherError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = (message || '');
}
util.inherits(geocacherError, Error);

const validate = options => {
  requiredOptions.forEach(function (option) {
   if (!options[option]) {
     throw new Error(`Missing Geofence Plugin option ${option}`);

   }
  });
} // End Validate options if required options are available if not throw error


function GeoFence (options) {
  validate(options);
  this.dbURL = options.dbURL;
  this.collection = options.collection;
}
util.inherits(GeoFence, EventEmitter);

GeoFence.initialize = function (options) {
  return new GeoFence(options);;
};

GeoFence.prototype.start = function () {
  var self = this
    mongoose.connect(self.dbURL,{ useMongoClient: true }, function(err, db) {
        if (err) {
            self.emit('error', "Geofence Mongo Database Not Available!");
        } else {
            self.emit('ready', "Geofence Mongo Database Ready");

        }
    });
};


GeoFence.prototype.lookUpGeofence = function(longitude, latitude, cb){
  var self = this

  var coords = {
          type: "Point",
          coordinates: [longitude, latitude]
      };
  geofence.find(
    {geofence:
      {$geoIntersects:
        {$geometry:coords}
      }
    },(err, results) => {

      if(err){
        if(cb!==undefined){
          cb(err)
        }else{
          self.emit('lookUpGeofence:error', err);
        }
      }else{
        if(cb!==undefined){
          cb(results)
        }else{
          self.emit('lookUpGeofence:results', results);
        }
      }
  });
}

GeoFence.prototype.arrangeGeofence = (geofence, cb) => {
  console.log(geofence)

}
module.exports = GeoFence;


//TEST Point in both 121.00158333778381,14.6328616393338
//TEST Point for Banawe Area Only 121.00127756595612, 14.634185192472579
