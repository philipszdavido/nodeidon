# Nodeidon
`Node.js` daemon that watches files/directories using [Nodejs FileWatcher](http://nodejs.org/api/fs.html#fs_class_fs_fswatcher) and re-spawns edited file/server using [Nodejs Child_Process spawn](http://nodejs.org/api/child_process.html).

# Installation
To install `nodeidon` globally in your system:

`npm i -g nodeidon`

To install `nodeidon` as a developement dependency:

`npm i nodeidon -D`

# Usage
To start a script

`nodeidon ./examples/server.js`

`nodeidon -w ./server/app.js -d "node server.js" "npm run start"`

### Contribute
1. Fork this repository
2. Clone it to your local machine
3. Create a branch for the feature you want to implement
4. Push your changes to your repository
5. Submit a pull request

- Issue Tracker: https://github.com/philipszdavido/nodeidon/issues
- Source Code: https://github.com/philipszdavido/nodeidon

### Support
If you are having issues, please let me know.
Mail me at: kurtwanger40@gmail.com
