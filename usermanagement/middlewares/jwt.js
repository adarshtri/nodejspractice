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
          message: "Token is not valid."
        });
      }else{
        req.jwtdecoded = decoded;
        next();
      }
    });
  } else{
    return res.json({
      success: false,
      message: "Auth token is not supplied."
    })
  }
};

exports.login = function(req,res){
  let username = req.body.username;
  let password = req.body.password;

  usermodel.findOne({username: username, password: password},function(err,user){
    if(err){
      res.json(err);
    } else if (user === null){
      res.json({
        message: "Invalid credentials.",
        data: req.body
      });
    }else{
      user.is_logged_in = true;
      let token = jwt.sign({username: username},
        config.jwtsecretkey,
        {
          expiresIn: '1m'
        }
      );

      user.save(function(err){
        if(err){
          res.json(err);
        }else{
          res.json({
            message:"Log in Succesfull.",
            data: user,
            token: token
          });
        }
      });
    }
  });
};
