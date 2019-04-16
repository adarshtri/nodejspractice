let mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
  matchName: {
    type: String,
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  firstteam: {
    type: String,
    required: true
  },
  secondteam: {
    type: String,
    required: true
  },
  venue: {
    type:  String,
    required: false
  },
  active: {
      type: Boolean,
      required: false,
      default: true
  }
},{collection: 'match'});


// export user model
var matchModel = module.exports = mongoose.model('match', matchSchema);
