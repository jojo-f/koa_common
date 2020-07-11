const path = require('path')
const mime = require('mime')
const fs = require('mz/fs')

function staticFiles(url, dir) {

    return async (ctx, next) => {
        let rpath = ctx.request.path

        if (rpath.startsWith(url)) {

            let fp = path.join(dir, rpath.substring(url.length))

            if (await fs.exists(fp)) {
                //查找文件mime类型
                // ctx.response.body = mime
                ctx.response.type = mime.getType(rpath)
                ctx.response.body = await fs.readFile(fp)
            } else {
                ctx.status = 404
            }
        } else {
            await next()
        }
    }
}

module.exports = staticFiles