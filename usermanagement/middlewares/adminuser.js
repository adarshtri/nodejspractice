exports.isadmin = function(req,res,next){
    if(req.jwtdecoded.is_admin){
        next();
    }else{
        res.json({
            message:"Not authorized to perform this action.",
            return_status: "error"
        });
    }
};

/*exports.getuserid = function(req,res,next){
    if(req.d)
}*/