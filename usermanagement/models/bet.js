let mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var betSchema = mongoose.Schema({
  matchid: {
    type: ObjectId,
    required: true
  },
  userid: {
    type: ObjectId,
    required: true
  },
  betamt: {
    type:  Number,
    required: false
  },
  match:{
      type: Object,
      required: false
  },
  user:{
    type: Object,
    required: false
  },
  paid:{
      type: Boolean,
      required: false,
      default: false
  },
  betteam:{
    type: String,
    required: true
  },
  cleared:{
    type: Boolean,
    required: false,
    default: false
  }
},{collection: 'bet'});


// export user model
var betModel = module.exports = mongoose.model('bet', betSchema);
