#!/usr/bin/env node

/**
 * Author: Chidume Nnamdi
 */

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const program = require('commander');
const eidon = require('./eidon')
var child = null
var killedIt
var filePath

/**
 * 
 * @param {*} args 
 */
function processArgs(args) {
    console.log(args)
}

/**
 * 
 * @param {*} filePath 
 */
function Spawn(filePath) {
    child = spawn('node', [filePath], {
        stdio: 'inherit'
    })
    if (child.stdout) {
        child.stdout.addListener('data', (c) => {
            console.log('SSSSSSSTTTTTTDDDDOOOUUUUUTTTT')
                //console.log(c)
        })
        child.stderr.addListener('data', (c) => {
            console.log('CRRRRAAAASSSSHHHHH')
                //console.log(c);
        })
    }

    child.addListener('error', (error) => {
        if (error.code === 'ENOENT') {
            console.log('unable to run executable')
            process.exit(1)
        } else {
            console.log('FRASH')
            throw error
        }
    })

    child.addListener('exit', (c, s) => {
        if (c === 127) {
            console.log('unable to run executable')
            process.exit()
        }
        if (c === 2) {
            console.log('process failed')
            process.exit()
        }

        if (c === 0) {
            console.log('error code 0 first')
            child = null
        } else {
            //console.log(`ERROR CODE: ${c} ==== SIGNAL: ${s}`)
                //console.log(child)

            //check if we killed the child
            if (killedIt) {
                Spawn(filePath)
                killedIt = false
            } else {
                child = null
            }
            // we have to stop spawn and wait for restart
            //Spawn(filePath)
        }
    })
    return child
}

function main() {
    filePath = arguments[0]
    let file = path.dirname(filePath)
    console.log('\x1b[33m%s\x1b[4m', '['+ new Date().toLocaleString() +'] - [nodeidon] watching ....')

    child = Spawn(filePath)
    let _dir

    if (fs.statSync(filePath).isDirectory()) {
        _dir = filePath
    } else {
        _dir = path.dirname(filePath)
    }
    //registerDirs(_dir)

    var c = 0

    fs.watch(file, { persistent: true }, (event, filename) => {
        c++
        console.log(`[${new Date().toLocaleString()}] - [nodeidon] changes on: ${filename}`)
        if (event === 'change') {
            if (filename) {
                //console.log(filename)
                if (c == 2) {
                    c = 0
                    if (child) {
                        process.kill(child.pid, "SIGTERM");
                        killedIt = true
                    } else {
                        Spawn(filePath)
                    }
                }
            }
        }
    })
}

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
        console.log(`${filename} : changed ==== event: ${event}`)

        // if event event is rename add the dir to watcher
    })
}

program
    .version(require('./../package.json').version, '-v, --version')
    .usage('[options] <command ...>')
    .description('Nodeidon- File/Server Management System')
    .option('-w, --watch', 'Watch files/directories')
    .option('-d, --daemon', 'Run multiple files concurrently')

program.on('--help', function() {
    console.log('  Examples:');
    console.log('');
    console.log('    $ nodeidon -w ./server/app.js -d "node server.js" "npm run start"');
    console.log('');
});
program
    .parse(process.argv);

(function(params) {
    var watches = []
    var daemons = []
    let d, f
    process.argv.forEach((arg) => {
        if (arg != '-w' && arg != '--watch' && arg != '-d' && arg != '--daemon') {
            if (d) {
                daemons.push(arg)
            }
            if (f) {
                watches.push(arg)
            }
        }
        if (arg == '-w' || arg == '--watch') {
            d = false
            f = true
        }
        if (arg == '-d' || arg == '--daemon') {
            f = false
            d = true
        }
    })

    /** start file/directory watcher */
    watches.forEach((w) => {
        main(w)
    })

    /** start the process daemons */
    eidon(daemons)
})()