// user routes

let router = require('express').Router();
let userController = require('../controllers/usercontroller');
let matchController = require('../controllers/matchcontroller');
let betController = require('../controllers/betcontroller');
let jwtmiddleware = require('../middlewares/jwt');
let adminmiddleware = require('../middlewares/adminuser');

router.route('/').get(function(req,res){
    res.redirect('/login.html');
});

router.route('/users')
.get(jwtmiddleware.checkjwttoken,userController.index)
.post(jwtmiddleware.checkjwttoken,userController.createNewUser);

router.route('/users/:user_id')
.get(jwtmiddleware.checkjwttoken,userController.getUserByIndex)
.put(jwtmiddleware.checkjwttoken,userController.updateUser)
.delete(jwtmiddleware.checkjwttoken,userController.deleteUser);

router.route('/users/isloggedin/:user_id')
.get(jwtmiddleware.checkjwttoken,userController.isUserLoggedIn);

router.route('/login')
.post(jwtmiddleware.login);

router.route('/newaccreq')
.post(userController.newuserreq);

router.route('/iausers')
.get(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, userController.getinactiveusers);

router.route('/matchodds/:matchid')
.get(jwtmiddleware.checkjwttoken, betController.getmatchodss);

router.route('/approveaccreq')
.post(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, userController.approvenewaccreq);

router.route('/match')
.get(jwtmiddleware.checkjwttoken, matchController.activematches)
.post(jwtmiddleware.checkjwttoken,adminmiddleware.isadmin, matchController.createNewMatch);

router.route('/match/:match_id')
.delete(jwtmiddleware.checkjwttoken,adminmiddleware.isadmin,matchController.deletematch);

router.route('/bet')
.get(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, betController.getallbetsuncleared)
.post(jwtmiddleware.checkjwttoken, betController.createnewBet);


router.route('/bet/:user_id')
.get(jwtmiddleware.checkjwttoken, betController.getBetByUserId);

router.route('/clearbet/:bet_id')
.get(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, betController.clearbetbyid);

router.route('/unpaidbet')
.get(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, betController.getUnpaidBets);

router.route('/approvebetpayment')
.post(jwtmiddleware.checkjwttoken, adminmiddleware.isadmin, betController.aprovepayment);

module.exports = router;
