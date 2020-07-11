const path = require('path')
const fs = require('mz/fs')

const router = require('koa-router')()
const contro = require('../_controller')
const conf = require('../../conf')
const mime = require('mime')

module.exports = function (path) {

    let contro_path = path || './controllers/'

    contro(router, contro_path)

    return router.routes()
}