const utils = require('../utils/route')
const sseQue = require('../../data/sse-db')

const test = async ctx => {
    ctx.body = '12'
}

const test2 = async ctx => {
    let {
        message
    } = ctx.request.body
    sseQue.push(message)
    ctx.body = true
}

module.exports = utils.to({
    'GET /': test,
    'POST /test': test2
}, '/index/')