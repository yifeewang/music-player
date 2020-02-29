const Router = require('koa-router');
const userController = require('../controllers/user.js');

const userRouter = new Router();

userRouter.get('/user/register', userController.showRegister)
.get('/user/login', userController.showLogin)
.get('/user/get-pic', userController.getPic)
.post('/user/check-username', userController.checkUsername)
.post('/user/do-register', userController.doRegister)
.post('/user/do-login', userController.doLogin)
module.exports  = userRouter