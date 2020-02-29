/**
 * 需求: 1:以/public开头,使用其他部分（正则）
 *       2:精确:/ 或者 /abc  要替换成 /xxx
 *       2.2:模糊: /xxx 开头 替换成/aaa
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
module.exports = (rules) => {
    // 一个ctx.url 对应多条规则的匹配
    return async (ctx, next) => {
        rules.forEach(rule => {
            // 是否需要使用正则
            if (rule.regxp) {
                let result = rule.regxp.exec(ctx.url);
                // result不匹配null或者匹配
                if (result) {
                    // 判断是直接赋值。还是取分组的内容
                    if (!rule.dist) {
                        // console.log(ctx.url, '分组正则字符串，最终改为:' + result[1])
                        // 还是取分组的内容
                        ctx.url = result[1];
                    } else {
                        // console.log(ctx.url, '精确正则字符串，最终改为:' + rule.dist)
                        ctx.url = rule.dist;
                    }
                }
            }
            // 字符串精确匹配的
            if (rule.src === ctx.url) {
                // console.log(ctx.url, '精确匹配字符串，最终改为:' + rule.dist)
                ctx.url = rule.dist;
            }
        })
        // // 处理静态资源
        // if(ctx.url.startsWith('/public') ) {
        //   // 重写URL
        //   ctx.url = ctx.url.replace('/public','');
        // }
        // // 处理首页
        // if (ctx.url === '/') {
        //   ctx.url = '/user/login';
        // }
        // 放行
        await next();
    }
}