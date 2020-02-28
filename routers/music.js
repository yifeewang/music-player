
const Router = require('koa-router');
const musicController = require('../controllers/music')

const musicRouter = new Router();

musicRouter
  .get('/music/index', ctx => ctx.render('index'))
  .post('/music/add-music', musicController.addMusic)
  .put('/music/update-music', musicController.updateMusic)
  .get('/music/edit', ctx => {
    console.log('edit');
})

module.exports  = musicRouter 