const {ipcRenderer,webFrame} = require('electron');
console.log('aaaaaaa');
class Injector{
  constructor(){
    this.initialize();
  }

  initialize(){
    console.log('aaaaaaaaaaaaaa')
    ipcRenderer.on('dom-ready',()=>{
      console.log('dom-ready');
      this.injectJs();
      this.isClean=true;
    });
  }

  injectJs(){
    this.initImage();
    // this.setZoomLevel();
    this.shortcutCapture();
    this.cancel();

    this.iconTopCursor = document.querySelectorAll('.icon_vertical_top')[0];
    this.iconLeftCursor = document.querySelectorAll('.icon_horizontal_left')[0];
    this.iconRightCursor = document.querySelectorAll('.icon_horizontal_right')[0];
    this.iconBottomCursor = document.querySelectorAll('.icon_vertical_bottom')[0];

    this.iconLeftTopCursor = document.querySelectorAll('.left_top')[0];
    this.iconRightTopCursor = document.querySelectorAll('.right_top')[0];
    this.iconLeftBottomCursor = document.querySelectorAll('.left_bottom')[0];
    this.iconRightBottomCursor = document.querySelectorAll('.right_bottom')[0];
    // this.cancelDraw();
  }

  setZoomLevel(){
   webFrame.setZoomFactor(100);
   webFrame.setZoomLevel(0);
   webFrame.setLayoutZoomLevelLimits(1,1);
  }

  initImage(){
    let imageobj=new Image();
    this.$imagecanvas = document.querySelector('#imagecanvas')
    this.imagectx = this.$imagecanvas.getContext('2d');

    let $this=this;
    imageobj.onload=function(){
      let wWidth=screen.width;;
      let wHeight=screen.height;
      $this.$imagecanvas.height=wHeight;
      $this.$imagecanvas.width=wWidth;
      $this.imagectx = $this.$imagecanvas.getContext('2d');
      $this.imagectx.drawImage(this,0,0,wWidth,wHeight);
      $this.onDrawImage();
    }
    imageobj.src=localStorage['imgdata'];
    /*用图片方式展示截图数据*/
    // this.canvas = document.querySelector('#imagecanvas')
    // this.width = screen.width;
    // this.height = screen.height;
    // this.canvas.width = this.width;
    // this.canvas.height = this.height;

    // this.$imagecanvas=new Image();
    // this.$imagecanvas.src=localStorage['imgdata'];
    // document.getElementsByTagName('body')[0].appendChild(this.$imagecanvas);
    // this.onDrawImage();
  }
  shortcutCapture(){
   this.$canvas = document.querySelector('#canvas')
   this.ctx = this.$canvas.getContext('2d')
   this.$canvas.width = 0
   this.$canvas.height = 0

   this.$captureToolbar = document.querySelector('#tools1')
  }

  onDrawImage () {
    const start = {
      x: 0,
      y: 0
    }
    const end = {
      x: 0,
      y: 0
    }

    const drag ={
      x: 0,
      y :0
    }
    //放大缩小时的开始坐标
    const  zoomStart ={
      x: 0,
      y :0
    }
    let isDraw = false,isZoom=false,isDrag=false,zoomFlag=undefined;
    document.addEventListener('mousedown', e => {

       if (e.target.dataset.zoom) {
        zoomStart.x=start.x;
        zoomStart.y=start.y;
        console.log(e.target.dataset.zoom);
        isZoom = isDraw = true;
        zoomFlag = e.target.dataset.zoom;
        this.hideTool();
      }
      // 拖拽处理
      else if (e.target.dataset.drag&&this.$cTools1.state.drawType==='drag') {
        console.log(e.target.dataset.drag);
        isDrag = isDraw = true;

        drag.x  = e.clientX//*window.devicePixelRatio//e.clientX
        drag.y  = e.clientY//*window.devicePixelRatio//e.clientY
        this.hideTool();
      }
      // 鼠标左键
      else if (e.button === 0&&this.isClean) {
        isDraw = true
        this.isClean=false
        start.x = end.x = e.clientX//*window.devicePixelRatio//e.clientX
        start.y = end.y = e.clientY//*window.devicePixelRatio//e.clientY
        this.hideTool();
      }
    })
    document.addEventListener('mousemove', e => {
      if (!isDraw) {
        return
      }
      if (isZoom) {

        switch(zoomFlag){
           case 'zoomtop':
              start.y=e.clientY;
              start.y= start.y<0?0:(start.y>window.innerHeight ?window.innerHeight-4 :start.y);
              break;
           case 'zoomright':
              end.x=e.clientX;
              end.x= end.x<0?0:(end.x> window.innerWidth ? window.innerWidth-4 :end.x);
              break;
           case 'zoomleft':
              start.x=e.clientX;
              start.x= start.x<0?0:(start.x> window.innerWidth ? window.innerWidth-4 :start.x);
              break;
           case 'zoombottom':
              end.y=e.clientY;
              end.y= end.y<0?0:(end.y>window.innerHeight ?window.innerHeight-4 :end.y);
              break;
          case 'zoomlefttop':
              start.x=e.clientX;
              start.x= start.x<0?0:(start.x> window.innerWidth ? window.innerWidth-4 :start.x);
              start.y=e.clientY;
              start.y= start.y<0?0:(start.y>window.innerHeight ?window.innerHeight-4 :start.y);
              break;
          case 'zoomrighttop':
              end.x=e.clientX;
              end.x= end.x<0?0:(end.x> window.innerWidth ? window.innerWidth-4 :end.x);
              start.y=e.clientY;
              start.y= start.y<0?0:(start.y>window.innerHeight ?window.innerHeight-4 :start.y);
              break;
          case 'zoomleftbottom':
              start.x=e.clientX;
              start.x= start.x<0?0:(start.x> window.innerWidth ? window.innerWidth-4 :start.x);
              end.y=e.clientY;
              end.y= end.y<0?0:(end.y>window.innerHeight ?window.innerHeight-4 :end.y);
              break;
          case 'zoomrightbottom':
              end.x=e.clientX;
              end.x= end.x<0?0:(end.x> window.innerWidth ? window.innerWidth-4 :end.x);
              end.y=e.clientY;
              end.y= end.y<0?0:(end.y>window.innerHeight ?window.innerHeight-4 :end.y);
              break;
        }
        //实时显示修改
        this.drawImage(start, end,false,zoomStart)
        zoomStart.x=start.x;
        zoomStart.y=start.y;
      }
      else if(isDrag){
        console.log("isDrag")
        if(start.y<0||start.x<0||end.y>window.innerHeight||end.x> window.innerWidth){
          if(start.y<=0){
            end.y -= start.y
            start.y=0
          }
          if(start.x<=0){
            end.x -= start.x
            start.x=0
          }
          if(end.y>=window.innerHeight){
            start.y -= (end.y-window.innerHeight)
            end.y=window.innerHeight
          }
          if(end.x>= window.innerWidth){
            start.x -= (end.x-window.innerWidth)
            end.x= window.innerWidth
          }
          return
        };


        start.y += (e.clientY - drag.y)
        start.x += (e.clientX - drag.x)
        end.y += (e.clientY - drag.y)
        end.x += (e.clientX - drag.x)
        drag.y = e.clientY
        drag.x = e.clientX
        this.drawImage(start, end,false)
      }
      else{
        console.log("else")
        end.x = e.clientX//*window.devicePixelRatio
        end.x= end.x<0?0:(end.x> window.innerWidth ? window.innerWidth-4 :end.x);
        end.y = e.clientY//*window.devicePixelRatio
        end.y= end.y<0?0:(end.y>window.innerHeight ?window.innerHeight-4 :end.y);
        this.drawImage(start, end,false)
      }

    })
    document.addEventListener('mouseup', e => {
      if (!isDraw) {
        return
      }
      isDraw = false
      if (isZoom) {
         isZoom=false;
         this.drawImage(start, end, true,zoomStart)
         zoomStart.x=0;
         zoomStart.y=0;
      }else if(isDrag){
         isDrag=false;
         this.drawImage(start, end, true)
      }
      else{
        end.x = e.clientX//*window.devicePixelRatio
        end.y = e.clientY//*window.devicePixelRatio
        this.drawImage(start, end, true)
      }


    })
  }

  drawImage (start, end, isShowToobar,zoomStart) {
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)
    let style = {}
    if (end.y > start.y) {
      style.top = start.y + 'px'
    } else {
      style.bottom = window.innerHeight - start.y + 'px'
    }
    if (end.x > start.x) {
      style.left = start.x + 'px'
    } else {
      style.right = window.innerWidth - start.x + 'px'
    }
    ['left', 'right', 'top', 'bottom'].forEach(key => {
      this.$canvas.style[key] = ''
      this.$captureToolbar.style[key] = ''
    })

    Object.keys(style).forEach(key => {
      if(style[key])
      this.$canvas.style[key] = style[key]
    })

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 清空绘图区域
    this.ctx.clearRect(0, 0, windowWidth, windowHeight);
    const x = start.x < end.x ? start.x : end.x;
    const y = start.y < end.y ? start.y : end.y;
    if (width <= 2 || height <= 2) {
      this.$canvas.width = 0
      this.$canvas.height = 0
      this.$canvas.style.visibility = 'hidden'
      this.$captureToolbar.style.visibility = 'hidden'

      if (isShowToobar) {
         this.isClean=true
      }
      return
    } else {
      this.$canvas.width = width
      this.$canvas.height = height
      this.$canvas.style.visibility = 'visible'
    }

    this.ctx.drawImage(this.$imagecanvas, x, y, width, height, 0, 0, width, height)
    this.showCursor( x, y, width, height)
    if(isShowToobar){
        if(!this.$cTools1){
          this.$cTools1 = new CanvasTools(this.$canvas, {container : document.getElementById('tools1')})
        }else{
          zoomStart&&console.log("start.x:"+x+"    start.y："+y+"    zoomStart.x："+zoomStart.x+"   zoomStart.y："+zoomStart.y)
          zoomStart?this.$cTools1.refreshSize(this.$canvas,x- zoomStart.x,y- zoomStart.y):this.$cTools1.refreshSize(this.$canvas,0,0,true);
        }
        const toolbarWidth = this.$captureToolbar.offsetWidth
        const toolbarHeight = this.$captureToolbar.offsetHeight
        let left = x + width - toolbarWidth
        let top = y + height + 7
        if (left < 0) {
          left = 0
        }
        if (left + toolbarWidth > windowWidth) {
          left = windowWidth - toolbarWidth
        }
        this.$captureToolbar.style.left = left + 'px'
        if (top + toolbarHeight > windowHeight) {
          top = y - toolbarHeight
        }
        if (top < 0) {
          top = 0
        }
        this.$captureToolbar.style.top = top + 'px'
        this.$captureToolbar.style.visibility = 'visible'
    }else{
       zoomStart&&this.$cTools1.refreshSize(this.$canvas,x- zoomStart.x,y- zoomStart.y)
    }
  }


  // 显示缩放框
  showCursor(x, y, width, height) {

    this.iconTopCursor.style.top = y-2+ 'px';
    this.iconTopCursor.style.left = x +width/2 + 'px';

    this.iconRightCursor.style.top = y +height/2 + 'px';
    this.iconRightCursor.style.left = x+width + 'px';

    this.iconLeftCursor.style.top = y +height/2 + 'px';
    this.iconLeftCursor.style.left = x-2 + 'px';

    this.iconBottomCursor.style.left = x +width/2 + 'px';
    this.iconBottomCursor.style.top = y+height + 'px';

    this.iconTopCursor.style.display = 'block';
    this.iconRightCursor.style.display = 'block';
    this.iconLeftCursor.style.display = 'block';
    this.iconBottomCursor.style.display = 'block';


    this.iconLeftTopCursor.style.top = y-2+ 'px';
    this.iconLeftTopCursor.style.left = x-2 +'px';
    this.iconRightTopCursor.style.top = y-2+ 'px';
    this.iconRightTopCursor.style.left = x+width-2 + 'px';
    this.iconLeftBottomCursor.style.left = x-2 +'px';
    this.iconLeftBottomCursor.style.top = y+height-2 + 'px';
    this.iconRightBottomCursor.style.top = y+height-2 + 'px';
    this.iconRightBottomCursor.style.left = x+width-2 + 'px';
    this.iconLeftTopCursor.style.display = 'block';
    this.iconRightTopCursor.style.display = 'block';
    this.iconLeftBottomCursor.style.display = 'block';
    this.iconRightBottomCursor.style.display = 'block';
  }

  // 隐藏工具栏
  hideTool() {
    // if(this.$cTools1){
    //   this.$cTools1.destory();
    // }

    this.$captureToolbar.style.visibility = 'hidden'
    // this.iconTopCursor.style.display = 'none';
    // this.iconRightCursor.style.display = 'none';
    // this.iconLeftCursor.style.display = 'none';
    // this.iconBottomCursor.style.display = 'none';
  }
  cancel () {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) {
        this.isClean=true;
        this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
        ipcRenderer.send('cancel-shortcut-capture');
      }
    })
  }

  cancelDraw () {
    this.isClean=true;
    const $cancel = document.querySelector('#cancel')
    $cancel.addEventListener('mousedown', e => {
      e.stopPropagation()
    })
    $cancel.addEventListener('click', e => {
      e.stopPropagation()
      this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
    })
  }

  refreshDraw(){
    this.isClean=true;
    this.drawImage({ x: 0, y: 0 }, { x: 0, y: 0 })
    this.iconTopCursor.style.display = 'none';
    this.iconRightCursor.style.display = 'none';
    this.iconLeftCursor.style.display = 'none';
    this.iconBottomCursor.style.display = 'none';
    this.iconLeftTopCursor.style.display = 'none';
    this.iconRightTopCursor.style.display = 'none';
    this.iconLeftBottomCursor.style.display = 'none';
    this.iconRightBottomCursor.style.display = 'none';

  }

}
var imageRectObj=new Injector();
global.sendFileToMac = function(canvas){
  const dataURL = canvas.toDataURL('image/jpeg')
  ipcRenderer.send('send-shortcut-capture', dataURL)
}
global.cancelShortCut = function(canvas){
  ipcRenderer.send('cancel-shortcut-capture');

}
global.refreshShortCut = function(){
  imageRectObj.refreshDraw();
}
global.downloadShortCut = function(){
  ipcRenderer.send('cancel-shortcut-capture');
}
