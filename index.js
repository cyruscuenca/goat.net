const electron = require('electron');
const { app, BrowserWindow } = electron;
const os = require('os');
var sys = require('util')
var exec = require('child_process').exec;
var macaddress = require('macaddress');

app.on('ready', () => {
    const mainWindow = new BrowserWindow({ 
        //frame: false, 
        width: 1000, 
        height: 600,
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    //mainWindow.setMenu(null);
});

// Keylogger

// UUID check

function puts(error, stdout, stderr) {
    console.log(stdout)
}

var hardDriveID = exec("wmic DISKDRIVE get SerialNumber", puts);
var ramSize = os.totalmem();
macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);  
});
console.log(exec("wmic CPU get ProcessorId", puts));
console.log(hardDriveID);

var supervisor = require('bindings')('supervisor');
supervisor();
var big_brother = require('bindings')('big_brother');
big_brother();