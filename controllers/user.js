const userModel = require('../models/user.js')

module.exports = {
    showRegister: async ctx => {
        let users = await userModel.getUsers()
        console.log(111,users);
        ctx.render('register')
    },
    showLogin: async ctx => {
        ctx.render('login')
    },
    checkUsername: async ctx => {
        const { username } = ctx.request.body
        
        const Users = await userModel.findUserByUsername(username)

        if(Users.length === 0 ){
            ctx.body = {code: '001', msg: '可以注册'}
            return
        }
        ctx.body = {code:'002', msg: '该用户已注册'}
    },
    doRegister: async ctx => {
        const { username, password, email, v_code } = ctx.request.body

        const Users = await userModel.findUserByUsername(username)

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
    }
}

