const Koa = require('koa')
const commander = require('commander')
const router = require('./server/routers/router')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const static_files = require('./server/_static_file')
const KoaCors = require('koa2-cors')



/**
 * @description 此处为测试内容
 * 
 */

const PROTOTYPE = require('./static/TEST/PROTOYPE')



const chalk = require('chalk')

let app = new Koa()



app
.use(async (context,callback) => {
    await callback()
    console.log(chalk.green(`请求路径为 : ${context.request.url},请求方法为 : ${context.request.method}`))
})
.use(static_files('./public/',__dirname + '/public'))
.use(KoaCors({
    origin:'*',
    exposeHeaders:[
        'WWW-Authenticate',
        'Server-Authorization',
    ],
    maxAge:5,
    credentials:true,
    allowMethods:[
        'GET',
        'POST',
        'DELETE',
        'OPTIONS'
    ],
    allowHeaders:[
        'Content-Type',
        'Authorization',
        'Accept',
        'x-auth-token',
        'X-Requested-With'
    ],
}))

let port = ''


app
    .use(koaStatic(__dirname,'public'))
    .use(bodyParser())
    .use(router())

commander
    .version('1.0.1')
    .command('port <port>')
    .action(function (p) {
        if(p){
            port = p
        }
    })

    commander.parse(process.argv)

const PROT = port || 3456

app.listen(PROT)

console.log(`serve started link to http://localhost:${ PROT }`)
