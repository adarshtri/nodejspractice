// import userModel
matchmodel = require('../models/match');

// handle index actions
exports.activematches = function(req,res){
  matchmodel.find({},function(err,matches){
    if(err){
      res.json({
        message: err,
        return_status: "error"
      });
    }
    res.json({
      message: 'Matches......',
      data: matches,
      return_status: "ok"
    });
  });
};

exports.getMatchByIndex = function(req,res){
  matchmodel.find({_id: req.params.match_id},function(err,match){
    if(err){
      res.send(err);
    }
    res.json({
      message: "Matches.",
      data: match
    });
  });
};

exports.createNewMatch = function(req,res){
  console.log(req.body);
  var match = new matchmodel();
  match.matchName = req.body.matchName;
  match.matchDate = req.body.matchDate;
  match.venue = req.body.venue;
  match.firstteam = req.body.firstteam;
  match.secondteam = req.body.secondteam;

  match.save(function(err){
    if(err)
      res.json({
        message: err,
        return_status: "error"
      });

      res.json({
        message: "New match created.",
        data: match,
        return_status: "ok"
      });
  });

};



/*exports.updateUser = function(req,res){
  usermodel.findById(req.params.user_id,function(err,user){

    if(err)
      res.json(err);

    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err){
      if(err)
        res.json(err);

      res.json({
        message: "User updated.",
        data: user
      });
    });

  });
};*/

exports.deletematch = function(req,res){
  matchmodel.remove({
    _id: req.params.match_id
  }, function(err,match){
    if(err)
      res.json(err);
    res.json({
      message: "Match deleted Succesfully.",
      data: match
    });
  });
};
