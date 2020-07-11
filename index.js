const Koa = require('koa')
const commander = require('commander')
const router = require('./server/routers/router')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const static_files = require('./server/_static_file')
const KoaCors = require('koa2-cors')
const http = require("http")
const path = require('path')
const fs = require('mz/fs')
const mime = require('mime')
const SocketIO = require("socket.io")

const sse = require('./server/lib/sse');
const db = require('./server/lib/db');
const sseQue = require('./data/sse-db')

const conf = require('./conf')

/**
 * @description 此处为测试内容
 * 
 */

// const PROTOTYPE = require('./static/TEST/PROTOYPE')



const chalk = require('chalk')

let app = new Koa()
const server = http.createServer(app.callback())
const io = SocketIO(server)

/* IO */
io.on("connection", client => {
    client.on("send", data => {
        client.broadcast.emit("send", data)
    })
    client.on("disconnect", () => {
        console.log("断开连接");
    })
})

app
    .use(async (context, callback) => {
        let {
            url
        } = context.request

        console.log(chalk.green(`请求路径为 : ${context.request.url},请求方法为 : ${context.request.method}`))
        // 默认页
        if (context.request.url === '/') {
            context.response.type = mime.getType('index.html')
            context.response.body = await fs.readFile(path.join(conf.__root, './static/index.html'))
            return
        }

        // server send event
        if (url === '/main-see') {

            context.req.setTimeout(Number.MAX_VALUE);
            context.type = "text/event-stream; charset=utf-8"

            context.set('Cache-Control', 'no-cache')
            context.set('Connection', 'keep-alive')

            const body = context.body = sse();
            const stream = db.subscribe('some event');
            stream.pipe(body);
            sseQue.stub(stream)
            const socket = context.socket;
            socket.on('error', close);
            socket.on('close', close);

            function close() {
                stream.unpipe(body);
                socket.removeListener('error', close);
                socket.removeListener('close', close);
            }
            return
        }


        await callback()
    })
    .use(koaStatic('public/', {
        maxage: 1000 * 60 * 60 * 12,
        index: 'index.html',
    }))
    .use(bodyParser())
    .use(router())
    .use(static_files('/', __dirname + '/static'))
    .use(KoaCors({
        origin: '*',
        exposeHeaders: [
            'WWW-Authenticate',
            'Server-Authorization',
        ],
        maxAge: 5,
        credentials: true,
        allowMethods: [
            'GET',
            'POST',
            'DELETE',
            'OPTIONS'
        ],
        allowHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'x-auth-token',
            'X-Requested-With'
        ],
    }))

let port = ''

commander
    .version('1.0.1')
    .command('port <port>')
    .action(function (p) {
        if (p) {
            port = p
        }
    })

commander.parse(process.argv)

const PROT = port || 7070

server.listen(PROT)

console.log(`serve started link to http://localhost:${ PROT }`)