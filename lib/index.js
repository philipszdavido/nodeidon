#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const program = require('commander');
const eidon = require('./eidon')
var child = null
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
        child.stdout.addListener('data', (c) => { console.log(c) })
        child.stderr.addListener('data', (c) => {
            console.log(c);
            console.log('CRRRRAAAASSSSHHHHH')
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
            console.log(`ERROR CODE: ${c} ==== SIGNAL: ${s}`)

            // we have to stop spawn and wait for restart
            Spawn(filePath)
        }
    })
    return child
}

function main() {
    filePath = arguments[0]
    let file = path.dirname(filePath)
    console.log('\x1b[33m%s\x1b[4m', 'nodeidon watching ....')

    child = Spawn(filePath)

    var c = 0
    fs.watch(file, { persistent: true }, (event, filename) => {
        c++
        console.log(`my c: ${c}`)
        if (event === 'change') {
            if (filename) {
                console.log(filename)
                if (c == 2) {
                    c = 0
                    if (child) {
                        process.kill(child.pid, "SIGTERM");
                    }
                }
            }
        }
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