'use strict'

const EventEmitter = require('events').EventEmitter
const mongoose = require('mongoose')
const geofence = require('./geofence.model.js')
const util = require('util')
const Polygon = require('polygon')
const _ = require('lodash')
mongoose.Promise = global.Promise

const requiredOptions = [
  'dbURL',
]

function geoFenceError(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = (message || '')
}
util.inherits(geoFenceError, Error)

const validate = options => {
  requiredOptions.forEach(function(option) {
    if (!options[option]) {
      throw new Error(`Missing Geofence Plugin option ${option}`)
    }
  })
}

function Geofence(options) {
  validate(options)
  this.dbURL = options.dbURL
  this.collection = options.collection
}
util.inherits(Geofence, EventEmitter)

Geofence.initialize = function(options) {
  return new Geofence(options)
}

Geofence.prototype.start = function() {
  let self = this
  mongoose.connect(self.dbURL, {
    useMongoClient: true
  }, function(err, db) {
    if (err) {
      self.emit('error', 'Geofence Mongo Database Not Available!')
    } else {
      self.emit('ready', 'Geofence Mongo Database Ready')

    }
  })
}

Geofence.prototype.lookUpGeofence = function(geofenceObj, callback) {
  let self = this
  let coords = {
    type: 'Point',
    coordinates: [geofenceObj.longitude, geofenceObj.latitude]
  }
  let query = {
    geometry: {
      $geoIntersects: {
        $geometry: coords
      }
    }
  }
  if (geofenceObj.query) {
    for (let key in geofenceObj.query) {
      query[key] = geofenceObj.query[key]
    }
  }
  geofence.find(
    query,
    (err, results) => {
      if (results) {
        if (callback) {
          callback(null, results)
        } else {
          self.emit('lookUpGeofence:results', results)
        }
      } else {
        if (callback) {
          callback(err)
        } else {
          self.emit('lookUpGeofence:error', err)
        }
      }
    }
  )
}

Geofence.prototype.arrangeGeofence = (geofence) => {
  let arrangement = new Array()
  let firstRun = true
  for (let key in geofence) {
    for (let compareKey in geofence) {
      if (geofence[key].name !== geofence[compareKey].name) {
        let flag = (new Polygon(geofence[key].geometry.coordinates[0]).containsPolygon(new Polygon(geofence[compareKey].geometry.coordinates[0])))

        if (flag) {
          if (firstRun) {
            arrangement.push([geofence[key].name, geofence[compareKey].name])
            firstRun = false
          } else {
            for (let arrKey in arrangement) {
              if (geofence[key].name === arrangement[arrKey][0]) {
                console.log(arrangement[arrKey].length)
                arrangement[arrKey].splice(1, 0, geofence[compareKey].name)
              } else {
                // arrangement.push([geofence[key].name, geofence[compareKey].name])
              }
            }
          }

        }
      }
    }
  }

  console.log(arrangement)
}
module.exports = Geofence