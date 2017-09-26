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
          console.log("READY")
            self.emit('ready', "Geofence Mongo Database Ready");

        }
    });
};


GeoFence.prototype.lookUp = function(longitude, latitude, cb){
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
                       console.log(results)
        });





    // geofence.geom.find({polygons:
    //                  {$geoIntersects:
    //                      {$geometry:{ "type" : "Point",
    //                           "coordinates" : [ 17.3734, 78.4738 ] }
    //                       }
    //                   }
    //              });

    // var geoOptions =  {
    //     spherical: true,
    //     maxDistance: this.maxDistance,
    //     num: this.resultLimit
    //     };
    // geocache.geoNear(coords, geoOptions, function(err, results, stats) {
    //     var locations;
    //     if (err) {
    //         cb(err)
    //     } else {
    //         if(results.length == 0){
    //           cb("No Result")
    //
    //         }else{
    //           cb(results)
    //
    //         }
    //     }
    // });


}
module.exports = GeoFence;


// geofence.geom.find({polygons:
//                  {$geoIntersects:
//                      {$geometry:{ "type" : "Point",
//                           "coordinates" : [ 17.3734, 78.4738 ] }
//                       }
//                   }
//              });

// var turf = require('@turf/turf');
// var polygon1 = turf.polygon([[            [
//               121.02176427841187,
//               14.608501646486474
//             ],
//             [
//               121.01891040802002,
//               14.605760783606817
//             ],
//             [
//               121.01996183395386,
//               14.604701804706831
//             ],
//             [
//               121.02036952972412,
//               14.605407791206858
//             ],
//             [
//               121.02071285247804,
//               14.605864604793071
//             ],
//             [
//               121.02116346359253,
//               14.60654982339286
//             ],
//             [
//               121.02154970169066,
//               14.60692357809261
//             ],
//             [
//               121.02197885513306,
//               14.607484208950911
//             ],
//             [
//               121.02206468582153,
//               14.607733377762354
//             ],
//             [
//               121.02206468582153,
//               14.608294006555536
//             ],
//             [
//               121.02176427841187,
//               14.608501646486474
//             ]]]);
//
//   var polygon2 = turf.polygon([[            [
//               121.02115273475646,
//               14.607671085585963
//             ],
//             [
//               121.02027297019958,
//               14.60692357809261
//             ],
//             [
//               121.0199725627899,
//               14.606103393335424
//             ],
//             [
//               121.02074503898619,
//               14.606414856261782
//             ],
//             [
//               121.02127075195311,
//               14.607307714205279
//             ],
//             [
//               121.02115273475646,
//               14.607671085585963
//             ]]]);
// var intersection = turf.intersect(polygon1, polygon2);
// var intersect = turf.getGeom(turf.polygon(intersection));
// var area_intersection = turf.area(intersect.coordinates);
// var area_poly1        = turf.area(polygon2);
// var percent_poly1_covered_by_poly2 = (area_intersection / area_poly1)*100;
// console.log(percent_poly1_covered_by_poly2)
// // console.log(geom.coordinates)
//
// var area2 = turf.area(intersect.coordinates);
// console.log(area)
// console.log(area2)
//TEST Point in both 121.00158333778381,14.6328616393338
//TEST Point for Banawe Area Only 121.00127756595612, 14.634185192472579
