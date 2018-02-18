const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

var filePath = process.argv[3]

/**
 * 
 * @param {*} args 
 */
function processArgs(args) {
    //console.log(args)
}

/**
 * 
 * @param {*} filePath 
 */
function Spawn(filePath) {
    console.log('spawning...')
    var child = spawn('node', [filePath], {
        stdio: 'inherit'
    })
    if (child.stdout) {
        child.stdout.addListener('data', (c) => { console.log(c) })
        child.stderr.addListener('data', (c) => { console.log(c) })
    }
    child.addListener('exit', (c) => {
        Spawn(filePath)
    })
    return child
}

function main() {
    processArgs(process.argv)
    let file = path.dirname(process.argv[3])
    console.log('\x1b[33m%s\x1b[4m', 'nodeidon watching ....')

    var child = Spawn(filePath)

    var c = 0
    fs.watch(file, { persistent: true }, (event, filename) => {
        c++
        if (event === 'change') {
            if (filename) {
                if (c == 2) {
                    c = 0
                    if (child) {
                        console.log('Killing process')
                        process.kill(child.pid, "SIGTERM");
                    }
                }
            }
        }
    })
}

main()