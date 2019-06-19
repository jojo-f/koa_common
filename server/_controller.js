const fs = require('fs')
const path = require('path')

const chalk = require('chalk')

function loading_Router(r, mapping) {

    for (let url in mapping) {
        if (url.startsWith('GET')) {

            let
                get_url_path = url.substring(4)

            r.get(get_url_path, mapping[url])

            console.log(`GET : ${get_url_path}`)

        } else if (url.startsWith('POST')) {

            let
                post_url_path = url.substring(5)

            r.post(post_url_path, mapping[url])

            console.log(`POST : ${post_url_path}`)

        } else {
            console.log(chalk.bgRed.white(`没有找到这个url: ${url}`))
        }
    }
}

function scan_Directory(r, src) {

    let
        src_join = path.join(__dirname, src)

    fs.readdir(src_join, (err, data) => {

        if (data !== undefined) {
            let files_js = data.filter(f => {
                return f.endsWith('.js')
            })

            files_js.forEach(f => {
                let mapping = require(src_join + f)

                loading_Router(r, mapping)
            })
        } else {
            console.log(chalk.red(`未获取到任何文件 or ${err}`))
        }


    })
}

module.exports = function (r, src) {
    scan_Directory(r, src)
}