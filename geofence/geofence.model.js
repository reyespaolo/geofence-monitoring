let mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

var geofenceSchema = mongoose.Schema({
  company: {
  		type: mongoose.Schema.Types.ObjectId,
  		ref: 'companies',
  		index: true
  },
  name: {
  		type: String,
  		required: true
  },
  description: String,
  options: {
    private: {
      type: Boolean,
      default: true
    },
    fillOpacity: {
      type: Number,
      default: 70
    },
    lineOpacity: {
      type: Number,
      default: 90
    },
    fillColor: {
      type: String,
      default: "000000"
    },
    lineColoe: {
      type: String,
      default: "000000"
    },
    radius: {
      type: Number,
      default: 0
    }
  },
  geofence: {
    type: {
      type: String,
      required: true
    },
    coordinates: [mongoose.Schema.Types.Mixed]
  },
   created_at: {
     type: Date,
     default: Date.now
   },
});

geofenceSchema.plugin(uniqueValidator);
geofenceSchema.index({ geofence: '2dsphere' });
// geofenceSchema.index({ name: 1, company: 1}, { unique: true });


var Geofence = mongoose.model('geofences', geofenceSchema);
module.exports = Geofence;
