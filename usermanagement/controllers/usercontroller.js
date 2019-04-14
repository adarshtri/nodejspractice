// import userModel
usermodel = require('../models/user');

// handle index actions
exports.index = function(req,res){
  usermodel.find({},function(err,users){
    if(err){
      res.send(err);
    }
    res.json({
      message: 'User details loading.',
      data: users
    });
  });
};

exports.getUserByIndex = function(req,res){
  usermodel.find({_id: req.params.user_id},function(err,users){
    if(err){
      res.send(err);
    }
    res.json({
      message: "Users.",
      data: users
    });
  });
};

exports.approvenewaccreq = function(req,res){
  usermodel.find({_id: req.body.userid}, function(err, user){
    if(err){
      res.json({
        return_status: "error",
        message: err
      });
    }else{
      user = user[0];
      user.active = true;
      user.save(function(err){
        if(err){
          res.json({
            return_status: "error",
            message: err
        });
       }else{
         res.json({
           return_status: "ok",
           message: "User approved!"
         });
       }
      });
    }
  });
};

exports.getinactiveusers = function(req,res){
  usermodel.find({active:false}, function(err,users){
    if(err){
      res.json({
        return_status: "error",
        message: err
      });
    }else{
      res.json({
        return_status: "ok",
        data: users,
        message: "Inactive Users!"
      })
    }
  });
}

exports.createNewUser = function(req,res){
  console.log(req.body);
  var user = new usermodel();
  user.username = req.body.username;
  user.password = req.body.password;

  user.save(function(err){
    if(err)
      res.json(err);

      res.json({
        message: "New user created.",
        data: user
      });
  });

};

exports.updateUser = function(req,res){
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
};

exports.deleteUser = function(req,res){
  usermodel.remove({
    _id: req.params.user_id
  }, function(err,user){
    if(err)
      res.json(err);
    res.json({
      message: "User deleted Succesfully.",
      data: user
    });
  });
};


exports.isUserLoggedIn = function(req,res){
  usermodel.findById(req.params.user_id,function(err,user){
    if(err){
      res.json(err);
    }
    res.json({
      is_logged_in: user.isLoggedIn()
    });
  });
};

exports.newuserreq = function(req,res){
  var pwd = req.body.password;
  var uname = req.body.username;

  user = new usermodel();
  user.username = uname;
  user.password = pwd;

  user.save(function(err){
    if(err){
      res.json({
        return_status : "error",
        message: err
      });
    }else{
      res.json({
        return_status: "ok",
        "message": "Request registered successfully."
      });
    }
  });
}

exports.login = function(req,res){
  var pwd = req.body.password;
  var uname = req.body.username;

  usermodel.findOne({username: uname, password:pwd, active: true}, function(err,user){
    if(err){
      res.json(err);
    }

    console.log("Value"  + user);

    if(user === null){
      res.json({
        message: "User doesn't exist or inactve account.",
        data: req.body
      });
    }else{

      user.is_logged_in = true;
      user.save(function(err){
        if(err){
          res.json(err);
        }
      });

      res.json({
        message: "User logged in Succesfully.",
        data: user
      });
    }

  });
};
