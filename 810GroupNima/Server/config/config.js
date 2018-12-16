//Add the db property to the each of the configurations in config.js.  
//The development config uses  a database called helpMe-dev, test uses helpMe-test and production uses helpMe.
//Mongoose will assume all the default connection details such as the port number.
//FROM FIRST STEPS WITH MONGOOSE PP, SLIDE 21

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: { name: 'UCCSS' },
        port: 5000,
        db: 'mongodb://127.0.0.1/helpMe-dev',
        secret: "nimalikedhistreats",
        uploads: './public/uploadedFiles' 
    },
    test: {
        root: rootPath,
        app: { name: 'UCCSS' },
        port: 4000,
        db: 'mongodb://127.0.0.1/helpMe-test',
        secret: "nimalikedhistreats",
        uploads: './public/uploadedFiles' 

    },

    production: {
        root: rootPath,
        app: { name: 'UCCSS' },
        port: 80,
        db: 'mongodb://127.0.0.1/helpMe',
        secret: "nimalikedhistreats",
        uploads: './public/uploadedFiles' 
    }
};

module.exports = config[env];



