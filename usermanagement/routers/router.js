// user routes

let router = require('express').Router();
let userController = require('../controllers/usercontroller');
let jwtmiddleware = require('../middlewares/jwt');

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

module.exports = router;
