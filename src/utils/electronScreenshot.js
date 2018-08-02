const { ipcRenderer, desktopCapturer } = require('electron');

module.exports = function() {
  let options = { types: ['screen'], thumbnailSize: { width: screen.width, height: screen.height }  }
    desktopCapturer.getSources(options, function (error, sources) {
      if (error) {
        return console.log(error)
      }
      let source=sources[0];
      console.log(sources);
      localStorage['imgdata']=source.thumbnail.toDataURL();//.toPNG();//.
      ipcRenderer.send('screenshot', source)
    })
}
