const Koa = require('koa');
const path = require('path')
const static = require('koa-static');
const musicRouter = require('./routers/music');
const userRouter = require('./routers/user');
const render = require('koa-art-template');
const bodyParser = require('koa-bodyparser');
const {appPort, viewDir, staticDir, uploadDir} = require('./config');
const error = require('./middlewares/error');
const rewrite = require('./middlewares/rewrite');
const rewriteConfig = require('./rewriteUrlConfig');
const formidable = require('koa-formidable');
const session = require('koa-session');

const app = new Koa();

//模板渲染
render(app, {
    root: viewDir,
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
  });
//处理错误
app.use(error())
// 为了给static重写URL
app.use(rewrite(rewriteConfig))
//请求静态资源
app.use(static(staticDir))
// 处理请求体数据 ctx.request.body获取
app.use(bodyParser());

let store = {
  storage:{},
  set(key,session) {
    this.storage[key] = session;
  },
  get(key){
    return this.storage[key];
  },
  destroy(key){
    delete this.storage[key];
  }
}
app.keys = ['test'];
// 基于test字符串进行签名的运算，为的是保证数据不被串改
// 处理session
app.use(session({store:store},app))

/**
 * 注意这里: 1:最初使用formidable接收文件，但是头是键值对的头，
 * 所以formidable帮我们将数据解析键值对了，打印出来数据非常多
 * 2:使用bodyParser的时候，仍然是键值对的头，他解析的时候，里面包含文件，所以报错 too large  请求体太大
 */

// 处理文件及字符串
app.use(formidable({
  // 设置上传目录，否则在用户的temp目录下
  uploadDir:uploadDir,
  // 默认根据文件算法生成hash字符串（文件名），无后缀
  keepExtensions:true
}));


//挂载路由
app.use(musicRouter.routes())
app.use(userRouter.routes())
//处理405 方法不匹配 和 501 方法未实现
app.use(musicRouter.allowedMethods())

app.listen(appPort,()=> {
    console.log(`端口开启在${appPort}`);
});