'use strict';
let EventEmitter = require('events').EventEmitter;
let mongoose = require('mongoose');
var geofence = require('./geofence.model.js');
let util = require('util');
let Polygon = require('polygon');
const _ = require('lodash');
mongoose.Promise = global.Promise;

var requiredOptions = [
    'dbURL',
];

function geoFenceError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = (message || '');
}
util.inherits(geoFenceError, Error);

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
  var self = this;
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
  var arrangement = new Array();;
  var firstRun = true;
  for(var key in geofence){
    for(var compareKey in geofence){
      if(geofence[key].name !== geofence[compareKey].name){
        var flag = (new Polygon(geofence[key].geofence.coordinates[0]).containsPolygon(new Polygon(geofence[compareKey].geofence.coordinates[0])))

        if(flag){
          if(firstRun){
            arrangement.push([geofence[key].name, geofence[compareKey].name])
            firstRun = false;
          }else{
            for(var arrKey in arrangement){
              // console.log(arrangement[arrKey][0])
              // console.log(arrangement[arrKey].length)
              if(geofence[key].name === arrangement[arrKey][0]){
                console.log(arrangement[arrKey].length)
                arrangement[arrKey].splice(1, 0, geofence[compareKey].name);

                // arrangement[arrKey][arrangement[arrKey].length] = geofence[compareKey].name
              }else{
                // arrangement.push([geofence[key].name, geofence[compareKey].name])
              }
            }
          }

        }
          // if(flag) console.log(`${flag} geofence ${geofence[key].name} -> ${geofence[compareKey].name}`)
          // var array = [
          //   ['1st Dimension' ,"2dimensional"]
          // ]
          // arrangement.push(array)
        // if(flag === true){
        // }
        // var firstPolygon = new Polygon(geofence[key].geofence.coordinates);
        // var comparePolygon = new Polygon(geofence[compareKey]);
        // console.log(firstPolygon.containsPolygon(comparePolygon))
        // containsPolygon()
        // console.log(geofence[key])
        // console.log(geofence[compareKey])
        // console.log(geofence[key].geofence.coordinates[0])
        // console.log(new Polygon(geofence[key].geofence.coordinates[0]))
        // if(new Polygon(geofence[key].geofence.coordinates[0]).containsPolygon(new Polygon(geofence[compareKey].geofence.coordinates[0]))){
        //   arrangedGeofence[key].children = {"test":"Test"}
        //   console.log("++++++++")
        // }
        // console.log(geofence[compareKey])
      }
    }
  }
  // alert(images[0][1]); // b

  console.log(arrangement)
}
module.exports = GeoFence;

//TEST Point in both 121.00158333778381,14.6328616393338
//TEST Point for Banawe Area Only 121.00127756595612, 14.634185192472579
