const { remote, ipcRenderer } = require('electron')

document.getElementById('minimize-button').addEventListener('click', () => {
    remote.getCurrentWindow().minimize()
})
  
document.getElementById('min-max-button').addEventListener('click', () => {
    const currentWindow = remote.getCurrentWindow()
    if(currentWindow.isMaximized()) {
      currentWindow.unmaximize()
    } else {
      currentWindow.maximize()
    }
})
  
document.getElementById('close-button').addEventListener('click', () => {
    remote.app.quit()
})

const {getCurrentWindow, globalShortcut} = require('electron').remote;

var reload = ()=>{
  getCurrentWindow().reload()
}

globalShortcut.register('F5', reload);
globalShortcut.register('CommandOrControl+R', reload);
// here is the fix bug #3778, if you know alternative ways, please write them
window.addEventListener('beforeunload', ()=>{
  globalShortcut.unregister('F5', reload);
  globalShortcut.unregister('CommandOrControl+R', reload);
})
