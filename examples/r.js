const fs = require('fs')
const path = require('path')

const dir = path.dirname('./examples/server.js')
console.log(dir)
registerDirs(dir)

function registerDirs(_dir) {
    watchDir(_dir)
    const _files = fs.readdirSync(_dir)
    _files.forEach((_file) => {
        _file = _dir + '/' + _file
        const _stat = fs.statSync(_file)
        if (_stat && _stat.isDirectory())
            registerDirs(_file)
            //watchDir(_file)
    })
}

function watchDir(dir) {
    fs.watch(dir, { persistent: true }, (event, filename) => {
        if (event === 'change') {
            console.log(`${filename} : changed`)
        }
    })
}