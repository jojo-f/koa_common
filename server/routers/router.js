const router = require('koa-router')()
const contro = require('../_controller')




router.get('/',async (ctx,next) => {

    ctx.response.body = "<h1>hellow this is koa-router</h1>"
    await next()
})


module.exports = function(path){

    let contro_path = path || '/routers/controllers/'
    
    contro(router,contro_path)

    return router.routes()
}