const musicModel = require('../models/music')
const path = require('path')

const singObject = ctx => {
    const {title, singer, time} = ctx.request.body
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
    singInformatin.uid = 1
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
              code:'002',msg:result.message
            };
            return;
          }
    
          ctx.body = {
            code:'001',msg:'更新成功'
          }
    }
}