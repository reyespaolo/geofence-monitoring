let mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const GeofenceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  availability: {
    type: String,
    required: true,
    default: 'Private'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  geometry: {
    type: {
      type: String,
      required: true
    },
    coordinates: [Schema.Types.Mixed]
  },
  showAsAddress: {
    type: Boolean,
    required: true,
    default: true
  },
  showMapAddress: {
    type: Boolean,
    required: true,
    default: false
  },
  strokeColor: String,
  strokeOpacity: Number,
  strokeWeight: Number,
  fillColor: String,
  fillOpacity: Number,
  isUploaded: Boolean
}, {
  timestamps: true
})

GeofenceSchema.plugin(uniqueValidator)
GeofenceSchema.index({ geometry: '2dsphere' })


const Geofence = mongoose.model('Geofence', GeofenceSchema)
module.exports = { Geofence, GeofenceSchema, mongoose }
