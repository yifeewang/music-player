const musicModel = require('../models/music')
const path = require('path')

const singObject = ctx => {
    const {title, singer, time, id} = ctx.request.body
    const {file, filerc} = ctx.request.files
    
    let singInformatin = {
        title, singer, time
    }

    singInformatin.filerc = 'no upload filerc'

    if(filerc){
        singInformatin.filerc  = '/public/files/' + path.parse(filerc.path).base
    }

    if(!file){
        ctx.throw('歌曲必须上传哦！！！')
        return
    }
    singInformatin.file = '/public/files/' + path.parse(file.path).base
    singInformatin.uid = id
    return singInformatin
}

module.exports = {
    addMusic: async ctx => {
        const singInformation = singObject(ctx)
        
        const result = await musicModel.addMusic(singInformation)
        
        if(result.affectedRows === 1){
            ctx.body = {
                code: '001', msg:' 添加成功！'
            }
            return
        }
        ctx.body = {
            code: '002', msg:' 添加失败!'
        }
    },
    updateMusic: async ctx => {
        const singInformation = singObject(ctx)
        const {id} = ctx.request.body
        Object.assign(singInformation, {id})
        
        const result = await musicModel.updateMusic(singInformation)
        
        if(result.affectedRows !== 1) {
            // 没有更新成功(throw是针对页面的操作，ajax请求，code:002)
            ctx.body = {
              code:'002',msg:'没有更新成功'
            };
            return;
          }
    
          ctx.body = {
            code:'001',msg:'更新成功'
          }
    },
    deleteMusic: async (ctx, next) => {
        //获取要删除的音乐id
        let {id} = ctx.request.query
        
        //对音乐进行删除
        const results = await musicModel.deleteMusic(id)

        if(results.affectedRows === 0){
            ctx.body = {code:'002', msg:'删除失败'}
            return 
        }

        ctx.body = {code:'001', msg:'删除成功'}
    },
    showEdit: async (ctx, next) => {
        //获取编辑id
        const {id} = ctx.query
        //查询获取要编辑的音乐数据
        const results = await musicModel.findMusicById(id)
        
        //处理异常
        if(results.length === 0){
            ctx.throw('编辑出错啦')
            return
        }
        //找到则把找到的数据渲染编辑页
        ctx.render('edit',{
            music:results[0]
        })
    },
    showIndex: async (ctx, next) => {
        // 根据用户的session中的id来查询数据======未完成====
        const uid = ctx.session.user.id;
        // 根据id查询歌曲
        const musics = await musicModel.findMusicByUid(uid);
        // 展示给用户
        ctx.render('index',{
            musics
        })
    },
    intoAdd: async ctx => {
        ctx.render('add')
    }
}