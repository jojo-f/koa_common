const rf = require('../../_readFile')   // 文件读取
const axios = require('../../_axios')   //http请求
const fictitious = require('../../../data/kg')

const BASE_URL = '/kg'

//请求首页数据
let home = async (ctx,next) => {

    ctx.response.status = 200
    ctx.response.body = fictitious.home
}









const URL_MAP = {
    'GET /':home,
}

function url_to(URL_MAP){

    let MAP = {}

    for(let item in URL_MAP){
        let start = item.indexOf(' ') + 1
            url = item.substring(0,start) + BASE_URL + item.substring(start + 1)
            MAP[url] = URL_MAP[item]
    }

    return MAP
}

module.exports = url_to(URL_MAP)