let jwt = require('jsonwebtoken');
const config = require('../config/config')
let usermodel = require('../models/user');

exports.checkjwttoken = function(req,res,next){
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if(token){
    jwt.verify(token, config.jwtsecretkey, (err,decoded) => {
      if(err){
        return res.json({
          success: false,
          message: "Token is not valid.",
          return_status: "invalid_access_token"
        });
      }else{
        req.jwtdecoded = decoded;
        next();
      }
    });
  } else{
    return res.json({
      success: false,
      message: "Auth token is not supplied.",
      return_status: "missing_auth_token"
    })
  }
};

exports.login = function(req,res){
  let username = req.body.username;
  let password = req.body.password;

  usermodel.findOne({username: username, password: password, active: true},function(err,user){
    if(err){
      err.return_status = "error";
      res.json(err);
    } else if (user === null){
      res.json({
        message: "Invalid credentials or inactive account.",
        data: req.body,
        return_status: "error"
      });
    }else{
      user.is_logged_in = true;
      let token = jwt.sign({username: user.username, is_admin:user.is_admin, id:user._id},
        config.jwtsecretkey,
        {
          expiresIn: '30m'
        }
      );

      user.save(function(err){
        if(err){
          err.return_status = "error";
          res.json(err);
        }else{
          res.json({
            message:"Log in Succesfull.",
            data: user,
            token: token,
            return_status: "ok"
          });
        }
      });
    }
  });
};
