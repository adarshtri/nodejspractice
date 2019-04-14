// import userModel
betmodel = require('../models//bet');
matchmodel = require('../models/match');
usermodel = require('../models/user');


String.prototype.toObjectId = function() {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
  };

/*
// handle index actions
exports.activematches = function(req,res){
  matchmodel.find({},function(err,matches){
    if(err){
      res.send(err);
    }
    res.json({
      message: 'Matches......',
      data: matches
    });
  });
};*/

/*exports.getMatchByIndex = function(req,res){
  matchmodel.find({_id: req.params.match_id},function(err,match){
    if(err){
      res.send(err);
    }
    res.json({
      message: "Matches.",
      data: match
    });
  });
};*/

exports.createnewBet = function(req,res){
  console.log(req.body);
  var bet = new betmodel();
  bet.matchid = req.body.matchid;
  bet.userid = req.body.userid;
  bet.betamt = req.body.betamt;
  bet.betteam = req.body.betteam;

  usermodel.find({_id:req.body.userid},function(err,user){
      if(err){
          return res.json({
              message: "Error handling requesting user.",
              return_status: "error"
          });
      }else{
          if(Object.keys(user).length == 0){
              return res.json({
                  message: "User with specified id doesn't exist.",
                  return_status: "error"
              });
          }else{
              matchmodel.find({_id:req.body.matchid}, function(err,match){
                if(err){
                    return res.json({
                        message: "Error handling specified match.",
                        return_status: "error"
                    });
                }else{
                    if (Object.keys(match).length == 0){
                        res.json({
                            message: "Specified match doesn't exists or is deleted.",
                            return_status: "error"
                        });
                    }else{

                        betmodel.count({userid:req.body.userid,matchid:req.body.matchid},function(err,betcount){
                            if(err){
                                res.json({
                                    message:"Error handling specified bet.",
                                    return_status: "error"
                                });
                            }else{
                                if(betcount > 0){
                                    res.json({
                                        message: "You have already placed a bet on this match.",
                                        return_status: "error"
                                    });
                                }else{
                                    bet.match = match[0];
                                    bet.user = user[0];
                                    bet.save(function(err){
                                        if(err)
                                          res.json(err);
                                    
                                          res.json({
                                            message: "New bet created.",
                                            data: bet,
                                            return_status: "ok"
                                          });
                                      });
                                }
                            }
                        });
                        
                    }
                }
              });
          }
      }
  });
};

exports.getBetByUserId = function(req,res){
    betmodel.find({userid: req.params.user_id}, function(err,bets){
        if(err){
            res.json({
                return_status: "error",
                message: err
            });
        }else{
            res.json({
                return_status: "ok",
                data: bets
            });
        }
    });
};

exports.getUnpaidBets = function(req,res){
    betmodel.find({paid: false}, function(err,bets){
        if(err){
            res.json({
                message: err,
                return_status: "error"
            });
        }else{
            res.json({
                data: bets,
                return_status: "ok",
                message: "Unpaid Bets."
            });
        }
    });
};

exports.aprovepayment = function(req,res){
    betmodel.find({_id:req.body.betid}, function(err,bet){
        if(err){
            res.json({
                return_status: "error",
                message: err
            });
        }else{
            bet = bet[0];
            bet.paid = true;
            bet.save(function(err){
                if(err){
                    res.json({
                        return_status: "error",
                        message: err
                    }); 
                }else{
                    res.json({
                        return_status: "ok",
                        message: "Payment Approved!"
                    });
                }
            });
        }
    });
}

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


exports.getmatchodss = function(req,res){
    betmodel.aggregate([{$match:{matchid:req.params.matchid.toString().toObjectId(),paid:true}},{$group:{_id:{team:"$betteam"},tot:{$sum:"$betamt"},cnt:{$sum:1},totpart:{$sum:{$divide:["$betamt",100]}}}}])
    .then(function(result){
      if (result.length > 2){
          res.json({
              return_status: "Error",
              data: "Something went wrong.",
              message: "Something went wrong."
          });
      }else if(result.length == 0){
        res.json({
            return_status: "Error",
            data: "No bets on this match.",
            message: "No bets on this match."
        });
      }else if(result.length == 1){
        data = {
            team1: result[0]._id.team,
            team2: "",
            team1amtodd: 100,
            team2amtodd: 0,
            team1cntodd: 100,
            team2cntodd: 0,
            team1profitper100: Math.round(result[0].tot/result[0].totpart) - 100,
            team2profitper100: result[0].tot - 100,
            totalbets: result[0].cnt,
            totalamt: result[0].tot
        }

        res.json({
            return_status: "ok",
            data: data,
            message: "Match odds."
        });

      }else{
        data = {
            team1: result[0]._id.team,
            team2: result[1]._id.team
        }

        amt1 = result[0].tot;
        amt2 = result[1].tot;
        cnt1 = result[0].cnt;
        cnt2 = result[1].cnt;

        sumamt = amt1 + amt2;
        sumcnt = cnt1 + cnt2;

        data.team1amtodd = Math.round((amt1/sumamt)*100);
        data.team2amtodd = Math.round((amt2/sumamt)*100);

        data.team1cntodd = Math.round((cnt1/sumcnt)*100);
        data.team2cntodd = Math.round((cnt2/sumcnt)*100);

        data.team1profitper100 = Math.round(sumamt/result[0].totpart) - 100;
        data.team2profitper100 = Math.round(sumamt/result[1].totpart) - 100;
        data.totalbets = cnt1 + cnt2;
        data.totalamt = sumamt;
        
        res.json({
            return_status: "ok",
            data: data,
            message: "Match odds."
        });

      }
  
    });
  };


  exports.getallbetsuncleared = function(req,res){
      betmodel.find({cleared:false},{},function(err,bets){
        if(err){
            res.json({
                return_status: "error",
                message: "Something went wrong."
            });
        }

        res.json({
            return_status: "ok",
            data: bets
        });

      });
  }

  exports.clearbetbyid = function(req,res){
      betmodel.find({_id: req.params.bet_id},function(err,bet){
          if(err){
              res.json({
                  return_status: "error",
                  message: "Something went wrong."
              });
          }

          bet = bet[0];
          bet.cleared = true;
          bet.save(function(err){
              if(err){
                  res.json({
                      return_status: "error",
                      message: "Something went wrong"
                  });
              }
              
              res.json({
                  return_status: "ok",
                  message: "Bet cleared.",
              });
          });
      });
  }
