
const Router = require('koa-router');
const musicController = require('../controllers/music')

const musicRouter = new Router();

musicRouter
  .get('/music/index', musicController.showIndex)
  .post('/music/add-music', musicController.addMusic)
  .delete('/music/del-music', musicController.deleteMusic)
  .put('/music/update-music', musicController.updateMusic)
  .get('/music/edit-music', musicController.showEdit)

module.exports  = musicRouter 