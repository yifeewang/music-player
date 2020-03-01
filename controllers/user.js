const userModel = require('../models/user.js')
const captchapng = require('captchapng2')

module.exports = {
    showRegister: async ctx => {
        // let users = await userModel.getUsers()
        ctx.render('register')
    },
    showLogin: async ctx => {
        ctx.render('login')
    },
    checkUsername: async ctx => {
        console.log('checkUsername')
        const { username } = ctx.request.query
        
        const Users = await userModel.findUserByUsername(username)
        
        if(Users.length === 0 ){
            ctx.body = {code: '001', msg: '可以注册'}
            return
        }
        ctx.body = {code:'002', msg: '该用户已注册'}
    },
    doRegister: async ctx => {
        const { username, password, email, v_code } =  ctx.request.query//ctx.request.body
        // 比较v_code
        if(v_code !== ctx.session.v_code) {
            ctx.body = {
                code:'002',
                msg:'验证码不正确'
                };
            return;
        }
        const Users = await userModel.findUserByUsername(username)
        //不能有相同用户名
        if(Users.length !== 0 ){
            ctx.body = {code: '002', msg: '该用户已注册'}
            return
        }

        try {
            const result = await userModel.doRegister(username, password, email)

            if(result.affectedRows === 1){
                ctx.body = {code: '001', msg: '注册成功'}
                return 
            }
            // 不等于1的情况会发生在id冲突，就不插入数据
             ctx.body = { code:'002' , msg:result.message };
        } catch (error) {
            ctx.throw({code: '002'})
        }
    },
    doLogin: async ctx => {
        //获取用户数据
        const {username, password} = ctx.request.query//ctx.request.body
        //核查用户是否已经注册
        const results = await userModel.findUserByUsername(username)
        //返回空数组表示数据库没有该用户名,未注册
        if(results.length === 0){
            ctx.body = {code:'002', msg: '用户名或密码错误'}
            return
        }
        const result = results[0]
        
        if(result.password === password){
            ctx.body = {code:'001', msg: '登陆成功'}
            //挂载session,用于用户验证
            ctx.session.user = result
            return
        }
        //密码错误
        ctx.body = {code:'002', msg: '用户名或密码错误'}
    },
    getPic: async (ctx, next) => {
        let rand = parseInt(Math.random() * 9000 + 1000)

        ctx.session.v_code = rand + ''

        let png = new captchapng(80, 30, rand) // width,height, numeric captcha
        
        ctx.body = png.getBuffer()
    },
    /**
     * 1：清除session上的user
     * 2: 重定向一个页面到login
     * @return {[type]} [description]
     */
    async logout(ctx,next) {
      ctx.session.user = null;
      ctx.redirect('/user/login');
    }
}

