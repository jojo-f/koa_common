const path = require('path')
const fs = require('fs')


let readFile = (pa,cb) => {
    
    return new Promise( (resolve,reject) => {
        fs.readFile(pa,(err,data) =>{
            if(!err){
                cb(data)
                resolve()
            }
        })
    })
}

module.exports = (name,callback,p) => {
    let src = p || '../data/'

    if(typeof name !== 'string'){
        throw new Error('请传入name')
    }

    let srcPath = path.join(__dirname,src + name)

    return readFile(srcPath,callback)
}