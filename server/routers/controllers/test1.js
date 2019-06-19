const env = require('../../_nunjucks') //模板
const rf = require('../../_readFile') // 文件读取
const axios = require('../../_axios') //http请求
const  weChat = require('../../lib/_wechat')//微信支付
const {URL} =require('url')

const $axios = require('axios')


const wechat_api = require('co-wechat-api')
const fs = require('fs')
const path = require('path')



// 请求服务器资源
let test2 = async (ctx, next) => {

    let a = await $axios('https://www.apiopen.top/femaleNameApi', {
            page: 1
        }),
        data = a.data.data,
        body = ''

    for (let item of data) {
        body = body + `<p style="font-size:4px;font-weight:100;font-family:'Courier New', Courier, monospace">${item.femalename}</p>`
    }

    ctx.response.body = body
}

// 读取本地资源
let test3 = async (ctx, next) => {

    let jsondata = {}

    await rf('test1.json', (data) => {
        jsondata = JSON.parse(data.toString()).data
    })

    ctx.response.body = env.render('hello.html', {
        data: jsondata
    })

}

//请求下小程序
let qt = async (ctx, next) => {

    /*公司小程序*/
    // 'appid' => 'wxbf362f9f3266cf2c',
    // 'secret' => '306a4064377f8d8240b221f68eeabef4',
    // ''

    const wxAppAPI = new wechat_api('wxbf362f9f3266cf2c', '306a4064377f8d8240b221f68eeabef4')
    const token = await wxAppAPI.ensureAccessToken()

    const page = 'pages/index/index'
    const scene = '123'


    // const url = `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token.accessToken}`
    console.log(token.accessToken)
    const response = await $axios({
        method: 'post',
        url: "https://api.weixin.qq.com/wxa/getwxacodeunlimit",
        responseType: 'stream',
        params: {
            access_token: token.accessToken
        },
        data: JSON.stringify({
            scene
        })
    })

    qtimg = fs.createWriteStream('public/images/qt.png')

    response.data.pipe(qtimg)

    ctx.body = `<img src="./public/images/qt.png"/>`

}
//返回本地qt图html代码
let pay = async(ctx,next) => {

    ctx.body = `<img src="./public/images/qt.png"/>`

}

//jsonp测试
let jsonps = async(ctx,next) => {

    let result
    
    let query_reg = /\?([^#]+)/igm,
        hash_reg = /#([\w\W]+)/igm

    let query = query_reg.exec(ctx.url),
        hash = hash_reg.exec(ctx.url)

    let query_obj = query ? query[1].split('&') : ''

    result = []
    query_obj.forEach(item => {
        let jn = item.split('='),
            key = jn[0],
            val = jn[1]

        result.push({
            [key]:val
        })
    })
    
    var rsp 

    for(let key in result){

        if(result[key]['callback']){
            rsp = result[key]['callback']
        }

    }

    ctx.response.body = `${rsp}(123)`
    
}

module.exports = {
    'GET /nickname': test2,//昵称 api ，三方服务器
    'GET /local_json': test3,//请求json本地数据
    // 'GET /qt': qt, //请求微信服务器二维码
    'GET /local_qt':pay,//请求本地二维码
    'GET /jsonp':jsonps,//测试jsonp请求
}