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

exports.login = function(req,res){
  var pwd = req.body.password;
  var uname = req.body.username;

  usermodel.findOne({username: uname, password:pwd}, function(err,user){
    if(err){
      res.json(err);
    }

    if(user === null){
      res.json({
        message: "User doesn't exist.",
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
