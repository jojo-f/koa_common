const nj = require('nunjucks')
const path = require('path')

function createEnv(path,opts){
    let
        autoEscape = opts.autoEscape === undefined ? true : opts.autoEscape, //是否开启全局模板转义
        noCache = opts.noCache || false, //是否开启服务器模板缓存
        watch = opts.watch || false, //
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nj.Environment(
            new nj.FileSystemLoader(path,{
                noCache:noCache,
                watch:watch
            }),{
                autoEscape:autoEscape,
                throwOnUndefined:throwOnUndefined
            }
        )

        if(opts.filters){
            for(let f in opts.filters){
                env.addFilter(f,opts.filters[f])
            }
        }
        return env
}

let env = createEnv(path.resolve(__dirname,'../src/template'),{
    watch:true,
    filters:{
        hex:function( n ){
            return '0x' + n.toString(16)
        }
    }
})

module.exports = env