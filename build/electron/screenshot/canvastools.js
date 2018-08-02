/*!
 * CanvasTools v1.0.0 
 * (github)https://github.com/S-mohan/canvasTools
 * (url) https://smohan.net/lab/canvastools
 * (c) smohan <https://smohan.net>
 * license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("CanvasTools", [], factory);
	else if(typeof exports === 'object')
		exports["CanvasTools"] = factory();
	else
		root["CanvasTools"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//Element.closet Polyfill
//https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {};
        } while (i < 0 && (el = el.parentElement));
        return el;
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var ButtonsMap = {
	rect: {
		panel: 'stroke',
		name: '矩形工具'
	},
	ellipse: {
		panel: 'stroke',
		name: '椭圆工具'
	},
	brush: {
		panel: 'stroke',
		name: '画笔工具'
	},
	arrow: {
		panel: 'stroke',
		name: '箭头工具'
	},
	mosaic: {
		panel: 'mosaic',
		name: '马赛克工具'
	},
	font: {
		panel: 'font',
		name: '文字工具'
	},
	rubber: {
		name: '橡皮擦'
	},
	undo: {
		name: '撤销操作'
	},
	save: {
		name: '保存'
	},
	ok: {
		name: '确定'
	},

	cancel: {
		name: '取消'
	}
	
	//可用颜色
};var ColorList = ['#000000', '#808080', '#800000', '#f7883a', '#308430', '#385ad3', '#800080', '#009999', '#ffffff', '#c0c0c0', '#fb3838', '#ffff00', '#99cc00', '#3894e4', '#f31bf3', '#16dcdc'];

//可选择字号，Chrome不支持小于12号的字体
var FontSize = [12, 14, 16, 18, 20, 22];

//画笔大小
var StrokeWidth = [2, 4, 6];

/**
 * 获取buttons模版 
 * @param  {Array}  buttons [可用按钮]
 * @return {String} 
 */
var getButtons = function getButtons() {
	var buttons = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

	var html = [];
	var useButton = function useButton(btn) {
		return buttons && !!~buttons.indexOf(btn);
	};
	for (var key in ButtonsMap) {
		if (useButton(key)) {
			var btn = ButtonsMap[key];
			html.push('<div class="canvas-tools-btn js-btn" data-panel="' + (btn.panel || '') + '" data-value="' + key + '" data-action="" title="' + btn.name + '">\n\t\t\t<a class="btn-toggle"><i class="canvas-tools-icon__' + key + '"></i></a>\n\t\t\t</div>');
		}
	}
	return html.join('');
};

/**
 * 获取颜色面板
 * @param  {String} color [当前选中色]
 * @return {String}
 */
var getColorPanel = function getColorPanel() {
	var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#fb3838';

	var html = '';
	html += '<div class="colors">';
	html += '<span class="color-selected"><i class="js-color-selected" style="background:' + color + '"></i></span>';
	html += '<div class="color-list">';

	var items1 = [],
	    items2 = [];
	for (var i = 0; i < 16; i++) {
		var item = '<li class="js-color" style="background:' + ColorList[i] + '" data-value="' + ColorList[i] + '"></li>';
		if (i < 8) {
			items1.push(item);
		} else {
			items2.push(item);
		}
	}

	html += '<ul>' + items1.join('') + '</ul>';
	html += '<ul>' + items2.join('') + '</ul>';

	html += '</div>';
	html += '</div>';

	return html;
};

/**
 * 获取画笔大小面板
 * @param  {Number} stroke [当前画笔大小]
 * @return {String}  
 */
var getStrokePanel = function getStrokePanel() {
	var stroke = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

	var html = '<div class="strokes">';
	for (var i = 0, len = StrokeWidth.length; i < len; i++) {
		var size = StrokeWidth[i];
		var classes = ['stroke', 'js-stroke-width'];
		size === stroke && classes.push('active');
		html += '<a class="' + classes.join(' ') + '" data-value="' + size + '"><i style="width:' + (size + 1) + 'px;height:' + (size + 1) + 'px;"></i></a>';
	}
	html += '</div>';
	return html;
};

/**
 * 获取字号选择器
 * @param  {Number} fontSize [默认字号]
 * @return {String} 
 */
var getFontPanel = function getFontPanel() {
	var fontSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 12;

	var html = '<select class="font-select js-font-size">';
	for (var i = 0, len = FontSize.length; i < len; i++) {
		var size = FontSize[i];
		var selected = !!(size === fontSize) ? 'selected' : '';
		html += '<option value="' + size + '" ' + selected + '>' + size + '</option>';
	}
	html += '</select>';
	return html;
};

/**
 * 获取模糊度模版
 * @param  {Number} ambiguite [默认模糊度 0 - 1]
 * @return {String}  
 */
var getAmbiguity = function getAmbiguity() {
	var ambiguite = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : .5;
	return '<label class="ambiguite-range"><span>\u6A21\u7CCA\u5EA6</span><input type="range" min="0" step="0.01" max="1" value="' + ambiguite + '" class="js-mosaic-ambiguity"></label>';
};

exports.default = {
	getButtons: getButtons,
	getColorPanel: getColorPanel,
	getStrokePanel: getStrokePanel,
	getFontPanel: getFontPanel,
	getAmbiguity: getAmbiguity
};
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ArrayProto = Array.prototype;

var SelectorRegs = {
	id: /^#([\w-]+)$/,
	className: /^\.([\w-]+)$/,
	tagName: /^[\w-]+$/
};

var isObject = function isObject(obj) {
	return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
};

var isPlainObject = function isPlainObject(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * 获取元素对象集合
 * @param  {String} selector [选择器]
 * @param  {HTMLElement} context  [上下文对象]
 * @return {Array}          [元素节点集合]
 */
var $ = function $() {
	var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
	var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

	if (typeof selector === "string") {
		selector = selector.trim();
		var dom = [];
		if (SelectorRegs.id.test(selector)) {
			dom = document.getElementById(RegExp.$1);
			dom = dom ? [dom] : [];
		} else if (SelectorRegs.className.test(selector)) {
			dom = context.getElementsByClassName(RegExp.$1);
		} else if (SelectorRegs.tagName.test(selector)) {
			dom = context.getElementsByTagName(selector);
		} else {
			dom = context.querySelectorAll(selector);
		}
		return ArrayProto.slice.call(dom);
	}
	return [];
};

/**
 * 对象遍历
 * @param  {Object | Array}   object   [对象源]
 * @param  {Function} callback [回调]
 * @return  
 */
var each = function each(object, callback) {
	if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === "object" && typeof callback === "function") {
		if (Array.isArray(object)) {
			for (var i = 0, len = object.length; i < len; i++) {
				if (callback.call(object[i], i, object[i]) === false) {
					break;
				}
			}
		} else if ('length' in object && typeof object.length === "number") {
			//这地方不太严谨，谨慎使用
			for (var k in object) {
				if (callback.call(object[k], k, object[k]) === false) {
					break;
				}
			}
		}
	}
};

/**
 * 事件绑定，支持代理
 * @param  {HTMLElement}   element   [DOM元素]
 * @param  {String}   eventType [事件类型]
 * @param  {String}   selector  [选择器]
 * @param  {Function} callback  [回调]
 * @return 
 */
var bind = function bind(element, eventType, selector, callback) {
	var sel = void 0,
	    handler = void 0;
	if (typeof selector === "function") {
		handler = selector;
	} else if (typeof selector === "string" && typeof callback === "function") {
		sel = selector;
	} else {
		return;
	}
	if (sel) {
		//事件代理
		handler = function handler(e) {
			var nodes = $(sel, element);
			var matched = false;
			for (var i = 0, len = nodes.length; i < len; i++) {
				var node = nodes[i];
				if (node === e.target || node.contains(e.target)) {
					matched = node;
					break;
				}
			}
			if (matched) {
				callback.apply(matched, ArrayProto.slice.call(arguments));
			}
		};
	}

	element.addEventListener(eventType, handler, false);
};

/**
 * 事件解绑
 * @param  {HTMLElement}   element   [DOM元素]
 * @param  {String}   eventType [事件类型]
 * @param  {Function} callback  [回调]
 * @return 
 */
var unbind = function unbind(element, eventType, callback) {
	return element.removeEventListener(eventType, callback, false
		
			/**
		  * 获取指定元素样式
		  * @param  {HTMLElement} element
		  * @return {Object}  
		  */
			);
};var getComputedStyles = function getComputedStyles(element) {
	return element.ownerDocument.defaultView.getComputedStyle(element, null

	/**
  * 对象深度拷贝
  * @param  {Object} out
  * @return {Object}
  */
	);
};var extend = function extend() {
	var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	for (var i = 1, len = arguments.length; i < len; i++) {
		var obj = arguments[i];
		if (!obj || !Object.keys(obj).length) continue;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (isPlainObject(obj[key])) out[key] = extend(out[key], obj[key]);else out[key] = obj[key];
			}
		}
	}
	return out;
};

var $on = function $on(elements, eventType, selector, callback) {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	each(elements, function (index, element) {
		return bind(element, eventType, selector, callback);
	});
};

var $off = function $off(elements, eventType, callback) {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	each(elements, function (index, element) {
		return unbind(element, eventType, callback);
	});
};

var classList = function classList(elements) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'add';
	var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	each(elements, function (index, element) {
		return element.classList[type](classes);
	});
};

exports.default = {
	$: $,
	each: each,
	bind: bind,
	extend: extend,
	unbind: unbind,
	getComputedStyles: getComputedStyles,
	classList: classList,
	$on: $on,
	$off: $off
};
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(0);

__webpack_require__(1);

var _utils = __webpack_require__(3);

var _utils2 = _interopRequireDefault(_utils);

var _template = __webpack_require__(2);

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//stroke类型操作
var STROKE_TYPES = ['rect', 'ellipse', 'brush', 'arrow', 'mosaic', 'font', 'rubber','drag'];

//默认颜色
var STROKE_DEFAULT_COLOR = '#fb3838';

//默认画笔大小
var STROKE_DEFAULT_WIDTH = 2;

//辅助输入框padding值
var TEXT_HELPER_PADDING = 2;

//辅助输入框层级
var TEXT_HELPER_ZINDEX = 1990;

//辅助输入框ID
var TEXT_HELPER_ID = 'canvas-tools_text_helper';

//输入框默认字体大小
//以设置的字体大小为准，改值仅做辅助值
var TEXT_HELPER_FONT_SIZE = 12;

//字体
var TEXT_FONT_FAMILY = '"Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","WenQuanYi Micro Hei",sans-serif';

//马赛克模糊度
var AMBIGUITY_LEVEL = .7;

/**
 * 创建画笔+颜色容器
 * @param  {Number} stroke [默认画笔]
 * @param  {String} color  [默认颜色]
 * @return {HTMLElement}   
 */
var buildStrokePanel = function buildStrokePanel() {
	var stroke = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STROKE_DEFAULT_COLOR;
	var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STROKE_DEFAULT_COLOR;

	var el = document.createElement('div');
	el.className = 'canvas-tools__panel js-panel__stroke';
	el.style.cssText += 'white-space: nowrap!important;';
	el.innerHTML = _template2.default.getStrokePanel(stroke) + _template2.default.getColorPanel(color);
	return el;
};

/**
 * 创建字号+颜色容器
 * @param  {Number} fontSize [默认字号]
 * @param  {String} color  [默认颜色]
 * @return {HTMLElement}   
 */
var buildFontPanel = function buildFontPanel() {
	var fontSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TEXT_HELPER_FONT_SIZE;
	var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STROKE_DEFAULT_COLOR;

	var el = document.createElement('div');
	el.className = 'canvas-tools__panel js-panel__font';
	el.style.cssText += 'white-space: nowrap!important;';
	el.innerHTML = _template2.default.getFontPanel(fontSize) + _template2.default.getColorPanel(color);
	return el;
};

/**
 * 创建画笔 + 模糊度容器
 * @param  {Number} stroke    [默认画笔]
 * @param  {Number} ambiguity [默认模糊度]
 * @return {HTMLElement}  
 */
var buildAmbiguityPanel = function buildAmbiguityPanel() {
	var stroke = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STROKE_DEFAULT_COLOR;
	var ambiguity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AMBIGUITY_LEVEL;

	var el = document.createElement('div');
	el.className = 'canvas-tools__panel js-panel__mosaic';
	el.style.cssText += 'white-space: nowrap!important;';
	el.innerHTML = _template2.default.getStrokePanel(stroke) + _template2.default.getAmbiguity(ambiguity);
	return el;
};

/**
 * 创建辅助文本输入框
 * @return {HTMLElement}
 */
var getTextHelper = function getTextHelper() {
	var $textHelper = document.getElementById(TEXT_HELPER_ID);
	if (!$textHelper) {
		$textHelper = document.createElement('div');
		$textHelper.setAttribute('contenteditable', 'plaintext-only');
		$textHelper.setAttribute('spellcheck', 'false');
		$textHelper.setAttribute('id', TEXT_HELPER_ID);
		$textHelper.className = TEXT_HELPER_ID;
		document.body.appendChild($textHelper);
	}
	$textHelper.innerHTML = '';
	$textHelper.style.cssText = 'display: block';
	return $textHelper;
};

/**
 * 初始化辅助文本输入框样式
 * @param  {MouseEvent} event [鼠标事件]
 * @param  {Object} state [instance state]
 * @param  {Object} rect  [instance rect]
 * @return {HTMLElement}   
 */
var insertTextHelper = function insertTextHelper(event, state, rect) {
	var $textHelper = getTextHelper(),
	    threshold = state.fontSize || TEXT_HELPER_FONT_SIZE,
	    padding = 2 * TEXT_HELPER_PADDING + 2,
	    pos = getPos(event, rect);

	var x = event.pageX,
	    y = event.pageY,
	    maxW = Math.floor(rect.width - pos.x) - padding,
	    maxH = Math.floor(rect.height - pos.y) - padding;

	if (maxW <= threshold) {
		x -= threshold + padding - maxW;
		maxW = threshold;
	}

	if (maxH <= threshold) {
		y -= threshold + padding - maxH;
		maxH = threshold;
	}

	if (maxW >= rect.width) {
		maxW = rect.width - pos.x;
	}

	if (maxH >= rect.height) {
		maxH = rect.height - pos.y;
	}

	var styleMap = {
		'font-size': threshold + 'px',
		'line-height': threshold + 'px',
		'min-width': threshold + 'px',
		'min-height': threshold + 'px',
		'max-width': maxW + 'px',
		'max-height': maxH + 'px',
		'z-index': TEXT_HELPER_ZINDEX,
		'font-family': TEXT_FONT_FAMILY,
		display: 'block',
		position: 'absolute',
		top: y + 'px',
		left: x + 'px',
		color: state.strokeColor,
		padding: TEXT_HELPER_PADDING + 'px',
		overflow: 'hidden'
	};

	var style = '';

	for (var key in styleMap) {
		style += key + ':' + styleMap[key] + ';';
	}

	$textHelper.style.cssText = style;
	$textHelper.focus();
	return $textHelper;
};

/**
 * 移除辅助文本输入框
 * @return 
 */
var removeTextHelper = function removeTextHelper() {
	var $textHelper = document.getElementById(TEXT_HELPER_ID);
	if (!$textHelper) {
		return;
	}
	$textHelper.innerHTML = '';
	$textHelper.style.cssText = 'display: none';
};

/**
 * 获取鼠标在Canvas上的位置
 * @param  {Element Event} event [鼠标事件]
 * @param  {Object} rect  [Canvas rect]
 * @return {Object} 
 */
var getPos = function getPos(event, rect) {
	var x = event.pageX - rect.left;
	var y = event.pageY - rect.top;
	if (x <= 0) x = 0;
	if (x >= rect.width) x = rect.width;
	if (y <= 0) y = 0;
	if (y >= rect.height) y = rect.height;

	return {
		x: x,
		y: y
	};
};

/**
 * 默认配置
 * @type {Object}
 */
var defaults = {
	//工具条父级对象容器
	container: document.body,
	//显示按钮
	buttons: ['rect', 'ellipse', 'brush', 'font', 'mosaic', 'undo','drag','ok', 'cancel','save']

	//创建一个下载链接
};var $saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a'

//是否支持原生下载
);var canUseSaveLink = 'download' in $saveLink;

//下载文件
var __downloadFile = function __downloadFile() {
	var t = new Date();
	var formatFn = (num) => {
		if(num.toString().length === 2 || num.toString().length === 4) {
			return num.toString();
		}
		return `0${num}`;
	}
	var timeStr = [t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours() ,t.getMinutes(), t.getSeconds()].map(formatFn).join('')
	var fileName = `${timeStr}.png`;
	var canvas = this.canvas;

	if (canUseSaveLink) {
		var fileUrl = canvas.toDataURL('png');
		fileUrl = fileUrl.replace('image/png', 'image/octet-stream');
		setTimeout(function () {
			$saveLink.href = fileUrl;
			$saveLink.download = fileName;
			//触发click事件
			$saveLink.dispatchEvent(new MouseEvent('click'));			
		});
	}

	//for ie 10+ 
	else if (typeof navigator !== "undefined" && typeof canvas.msToBlob === 'function' && navigator.msSaveBlob) {
			navigator.msSaveBlob(canvas.msToBlob(), fileName);
			
	}

		// other 
	else {
			console.log('您的浏览器不支持该操作');
	}
};


var _sendFile=function _sendFile(){
	var canvas = this.canvas;
     sendFileToMac(canvas);

}
var _cancelSendFile=function _cancelSendFile(){
     cancelShortCut();
}

//相关事件绑定
function __bindEvents() {
	var self = this;
	var canvas = this.canvas,
	    context = this.context,
	    $el = this.$el,
	    state = this.state,
	    config = this.config,
	    rect = this.rect,
	    _handles = this._handles,
		history = this.history,
		historyDraws = this.historyDraws;


	var $btns = _utils2.default.$('.js-btn', $el),
	    $fontPanel = _utils2.default.$('.js-panel__font', $el)[0],
	    $strokePanel = _utils2.default.$('.js-panel__stroke', $el)[0],
	    $mosaicPanel = _utils2.default.$('.js-panel__mosaic', $el)[0],
	    $colorSelected = _utils2.default.$('.js-color-selected', $el),
	    $colors = _utils2.default.$('.js-color', $el),
	    $strokeWidth = _utils2.default.$('.js-stroke-width', $el),
	    $fontSize = _utils2.default.$('.js-font-size', $el),
	    $mosaicAmbiguity = _utils2.default.$('.js-mosaic-ambiguity', $el

	//按钮事件
	);_handles.btnEmit = function (event) {
		var _this = this;

		event.stopPropagation();
		if (state.drawType === 'font') {
			__drawFont.call(self, event);
		}
		var panel = this.getAttribute('data-panel');
		var value = this.getAttribute('data-value');
		_utils2.default.each($btns, function (index, $btn) {
			if ($btn !== _this) {
				_utils2.default.classList($btn, 'remove', 'active');
			}
		});
		if (!!~STROKE_TYPES.indexOf(value)) {
			state.drawType = value;
		}
		if (panel) {
			_utils2.default.classList(this, 'toggle', 'active');
			var isActive = /active/.test(this.className);
			var visible = isActive ? 'block' : 'none';
			if (panel === 'stroke') {
				$fontPanel.style.display = 'none';
				$mosaicPanel.style.display = 'none';
				$strokePanel.style.display = visible;
			} else if (panel === 'font') {
				$fontPanel.style.display = visible;
				$strokePanel.style.display = 'none';
				$mosaicPanel.style.display = 'none';
			} else if (panel === 'mosaic') {
				$mosaicPanel.style.display = visible;
				$fontPanel.style.display = 'none';
				$strokePanel.style.display = 'none';
			}
		} else {
			//$fontPanel.style.display = 'none'
			//$strokePanel.style.display = 'none'
		}
		
		if(value==='ok'){
			_sendFile.call(self);
			return;

		}
		if(value==='cancel'){
			_cancelSendFile.call(self);
			return;

		}
		if (value === 'save') {
			__downloadFile.call(self);
			return;
		}

		//history[0]是画布的初始状态
		//因此只有多于1个历史记录时才可以恢复上一步
		if (value === 'undo' && history.length > 1) {
			history.pop();
			historyDraws.pop();
			context.putImageData(history[history.length - 1], 0, 0, 0, 0, rect.width, rect.height);
		}else if(value === 'undo' && history.length == 1){
            refreshShortCut();

		}

		__toggleCanvasCursor.call(self);
	};

	_handles.toggleColor = function (event) {
		var color = this.getAttribute('data-value');
		state.strokeColor = color;
		_utils2.default.each($colorSelected, function (index, item) {
			return item.style.background = color;
		});
	};

	_handles.toggleStrokeWidth = function (event) {
		state.strokeWidth = Number(this.getAttribute('data-value'));
		_utils2.default.each($strokeWidth, function (index, item) {
			var value = Number(item.getAttribute('data-value'));
			var method = value === state.strokeWidth ? 'add' : 'remove';
			_utils2.default.classList(item, method, 'active');
		});
	};

	_handles.toggleFontSize = function (event) {
		state.fontSize = Number(this.value);
	};

	//鼠标在画布上的初始位置
	var _startPos = void 0;

	_handles.onMouseDown = function (event) {
		if (!!~STROKE_TYPES.indexOf(state.drawType) === false || state.drawType === 'font'|| state.drawType === 'drag') {
			return;
		}
		_startPos = getPos(event, rect

		//保存当前快照
		);state.lastImageData = context.getImageData(0, 0, rect.width, rect.height

		//初始化context状态
		);context.lineCap = 'round';
		context.lineJoin = 'round';
		context.shadowBlur = 0;
		context.strokeStyle = state.strokeColor;
		context.lineWidth = state.strokeWidth;
		self.tempDrawObj.strokeStyle = state.strokeColor;
		self.tempDrawObj.lineWidth =  state.strokeWidth;
		self.tempDrawObj.type=state.drawType;
		self.tempDrawObj.points=[];
		switch (state.drawType) {
			case 'rect':
				__drawRect.call(self, event, _startPos);
				break;
			case 'ellipse':
				__drawEllipse.call(self, event, _startPos);
				break;
			case 'mosaic':
				__drawMoasic.call(self, event);
				break;
			case 'brush':
			default:
				__drawBrush.call(self, event, _startPos);
				break;
		}

		_utils2.default.$on(document, 'mousemove', _handles.onMouseMove);
		_utils2.default.$on(document, 'mouseup', _handles.onMouseUp);
	};

	_handles.onMouseMove = function (event) {
		if (!!~STROKE_TYPES.indexOf(state.drawType) === false || state.drawType === 'font') {
			return;
		}
		switch (state.drawType) {
			case 'rect':
				__drawRect.call(self, event, _startPos);
				break;
			case 'ellipse':
				__drawEllipse.call(self, event, _startPos);
				break;
			case 'mosaic':
				__drawMoasic.call(self, event);
				break;
			case 'brush':
			default:
				__drawBrush.call(self, event, null);
				break;
		}
	};

	_handles.onMouseUp = function (event) {
		_utils2.default.$off(document, 'mousemove', _handles.onMouseMove);
		_utils2.default.$off(document, 'mouseup', _handles.onMouseUp);
		if (!!~STROKE_TYPES.indexOf(state.drawType) && state.drawType !== 'font') {
			__pushHistory.call(self);
			__pushHistoryDraws.call(self);

		}
	};

	_handles.insertTextHelper = function (event) {
		event.stopPropagation();
		if (state.drawType !== 'font') {
			return;
		}
		if (state.isEntry) {
			__drawFont.call(self, event);
			return;
		}
		insertTextHelper(event, state, rect);
		state.isEntry = true;
	};

	_handles.removeTextHelper = function (event) {
		if (state.drawType !== 'font') {
			removeTextHelper();
		} else if (!event.target.closest('#canvas-tools-input')) {
			__drawFont.call(self, event);
		}
	};

	_handles.resize = function (event) {
		var _rect = canvas.getBoundingClientRect();
		rect.width = canvas.width;
		rect.height = canvas.height;
		rect.offsetWidth = canvas.offsetWidth;
		rect.offsetHeight = canvas.offsetHeight;
		rect.top = _rect.top;
		rect.left = _rect.left;
		state.drawType === 'font' && state.isEntry && __drawFont.call(self, event);
	};

	_handles.toggleAmbiguity = function (event) {
		state.ambiguity = this.value;
		console.log(state);
	};

	//按钮事件
	_utils2.default.$on($btns, 'click', _handles.btnEmit

	//切换颜色
	);_utils2.default.$on($colors, 'click', _handles.toggleColor

	//切换画笔大小
	);_utils2.default.$on($strokeWidth, 'click', _handles.toggleStrokeWidth

	//切换字体大小
	);_utils2.default.$on($fontSize, 'change', _handles.toggleFontSize);

	_utils2.default.$on($mosaicAmbiguity, 'change', _handles.toggleAmbiguity

	//矩形，椭圆，画笔等绘制
	);_utils2.default.$on(canvas, 'mousedown', _handles.onMouseDown

	//插入文本辅助框
	);_utils2.default.$on(canvas, 'click', _handles.insertTextHelper

	//移除文本辅助框
	);_utils2.default.$on(document, 'click', _handles.removeTextHelper

	//window resize
	);window.addEventListener('resize', _handles.resize);
}

/**
 * 绘制矩形
 * @param  {MouseEvent} event [鼠标事件]
 * @param  {Object} start [起始位置]
 * @return 
 */
function __drawRect(event, start) {
	var context = this.context,
	    rect = this.rect,
	    state = this.state;

	var pos = getPos(event, rect);
	__watchDrawBound.call(this,start.x, start.y)
	var width = pos.x - start.x;
	var height = pos.y - start.y;
	this.tempDrawObj.points=[{
		x:start.x, y:start.y, width:width, height:height
	}];
	context.clearRect(0, 0, rect.width, rect.height);
	context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
	context.save();
	context.beginPath();
	context.strokeRect(start.x, start.y, width, height);
	context.restore();
	context.closePath();
	__watchDrawBound.call(this,start.x+width, start.y+height);
}
/**
 * 拖拽重绘绘制矩形自由绘制
 */
function __drawRectByHistory(historyObj) {
	
	var context = this.context,
	    rect = this.rect,
	    state = this.state;
	var obj=historyObj.points[0];
	context.strokeStyle = historyObj.strokeStyle;
	context.lineWidth = historyObj.lineWidth;
	context.clearRect(0, 0, rect.width, rect.height);
	context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
	context.save();
	context.beginPath();
	console.log("obj.x:"+obj.x+"    obj.y："+obj.y+"    this.hmovex："+this.hmovex+"   this.hmovey："+this.hmovey)
	context.strokeRect(obj.x-this.hmovex, obj.y-this.hmovey, obj.width, obj.height);
	context.restore();
	context.closePath();
	historyObj.points=[{
		x:obj.x-this.hmovex, y: obj.y-this.hmovey, width:obj.width, height:obj.height
	}];
}

/**
 * 绘制椭圆
 * @param  {MouseEvent} event [鼠标事件]
 * @param  {Object} start [起始位置]
 * @return 
 */
function __drawEllipse(event, start) {
	var context = this.context,
	    rect = this.rect,
	    state = this.state;

	var pos = getPos(event, rect);
	var scaleX = 1 * ((pos.x - start.x) / 2);
	var scaleY = 1 * ((pos.y - start.y) / 2);
	var x = start.x / scaleX + 1;
	var y = start.y / scaleY + 1;
	this.tempDrawObj.points=[{
		startx:start.x, starty:start.y, posx:pos.x, posy:pos.y
	}];
	context.clearRect(0, 0, rect.width, rect.height);
	context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
	context.save();
	context.beginPath();
	context.scale(scaleX, scaleY);
	context.arc(x, y, 1, 0, 2 * Math.PI);
	context.restore();
	context.closePath();
	context.stroke();
}

/**
 * 拖拽重绘绘制椭圆自由绘制
 */
function __drawEllipseByHistory(historyObj) {
	
	var context = this.context,
	    rect = this.rect,
	    state = this.state;
	var obj=historyObj.points[0];
	context.strokeStyle = historyObj.strokeStyle;
	context.lineWidth = historyObj.lineWidth;

	var scaleX = 1 * ((obj.posx - obj.startx) / 2);
	var scaleY = 1 * ((obj.posy - obj.starty) / 2);
	var x = (obj.startx-this.hmovex) / scaleX + 1;
	var y = (obj.starty-this.hmovey) / scaleY + 1;

	context.clearRect(0, 0, rect.width, rect.height);
	context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
	context.save();
	context.beginPath();
	context.scale(scaleX, scaleY);
	context.arc(x, y, 1, 0, 2 * Math.PI);
	context.restore();
	context.closePath();
	context.stroke();
	historyObj.points=[{
		startx:(obj.startx-this.hmovex) , starty: (obj.starty-this.hmovey), posx:(obj.posx-this.hmovex), posy:(obj.posy-this.hmovey)
	}];
}



/**
 * 画笔工具自由绘制
 * @param  {MouseEvent} event [鼠标事件]
 * @param  {Object | null} start [起始位置]
 * @return 
 */
function __drawBrush(event) {
	var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	var context = this.context,
	    rect = this.rect;
	
	if (start) {
		context.beginPath();
		context.moveTo(start.x, start.y);
		__watchDrawBound.call(this,start.x, start.y);
		this.tempDrawObj.points.push({
			x:start.x, y:start.y
		});
	} else {
		var pos = getPos(event, rect);
		__watchDrawBound.call(this,pos.x, pos.y);
		this.tempDrawObj.points.push({
			x:pos.x, y:pos.y
		});
		context.lineTo(pos.x, pos.y);
		context.stroke();
	}
}
/**
 * 拖拽重绘画笔工具自由绘制
 */
function __drawBrushByHistory(historyObj) {
	
	var context = this.context,
		rect = this.rect;
		context.strokeStyle = historyObj.strokeStyle;
		context.lineWidth = historyObj.lineWidth;
		let newPoints=[];
		let start= historyObj.points[0];
		context.beginPath();
		context.moveTo(start.x-this.hmovex, start.y-this.hmovey);
		newPoints.push({
			x:start.x-this.hmovex, y:start.y-this.hmovey
		})
        for(var i=1;i<historyObj.points.length;i++){
			var element=historyObj.points[i]
			context.lineTo(element.x-this.hmovex, element.y-this.hmovey);
			newPoints.push({
				x:element.x-this.hmovex, y:element.y-this.hmovey
			})
		}
		context.stroke();
		historyObj.points=newPoints;
}
/**
 * 绘制文字
 * @param  {MouseEvent} event [鼠标事件]
 * @return {[type]} 
 */
function __drawFont(event) {
	var $textHelper = document.getElementById(TEXT_HELPER_ID);
	if (!$textHelper) {
		this.state.isEntry = false;
		return;
	}
	var content = $textHelper.textContent.trim();
	var length = content.length;
	if (!content || !length) {
		this.state.isEntry = false;
		removeTextHelper();
		return;
	}
	var style = _utils2.default.getComputedStyles($textHelper),
	    threshold = this.state.fontSize || TEXT_HELPER_FONT_SIZE,
	    padding = 2 * TEXT_HELPER_PADDING,
	    context = this.context;

	var x = parseFloat(style.left) - this.rect.left + padding - 2,
	    y = parseFloat(style.top) - this.rect.top + threshold,
	    lineWidth = 0,
	    lastSubStrIndex = 0;

	context.beginPath();
	context.save();
	context.fillStyle = this.state.strokeColor;
	context.font = this.state.fontSize + 'px ' + TEXT_FONT_FAMILY;

	for (var i = 0; i < length; i++) {
		var char = content[i];

		//让文字自动换行
		lineWidth += context.measureText(char).width;
		if (lineWidth > this.rect.width - x) {
			context.fillText(content.substring(lastSubStrIndex, i), x, y);
			y += threshold;
			lineWidth = 0;
			lastSubStrIndex = i;
		}
		if (i == length - 1) {
			context.fillText(content.substring(lastSubStrIndex, i + 1), x, y);
		}
	}

	context.restore();
	context.closePath();
	this.historyDraws.push({type:"font",points:[{x:x,y:y}],fillStyle:this.state.strokeColor,font:this.state.fontSize + 'px ' + TEXT_FONT_FAMILY,content:content});
	this.state.isEntry = false;
	removeTextHelper();
	__pushHistory.call(this);
}
/**
 * 重新绘制文字
 * @param  {MouseEvent} event [鼠标事件]
 * @return {[type]} 
 */
function __drawFontByHistory(historyObj) {

	var content =historyObj.content.trim();
	var length = historyObj.content.length;

	var lineWidth = 0,  lastSubStrIndex = 0,
	    threshold = historyObj.fontSize || TEXT_HELPER_FONT_SIZE,
	    context = this.context;
	var x = historyObj.points[0].x-this.hmovex,
	    y = historyObj.points[0].y-this.hmovey;

	context.beginPath();
	context.save();
	context.fillStyle =historyObj.fillStyle;
	context.font =historyObj.font;
	context.fillText(content, x, y);
	// for (var i = 0; i < length; i++) {
	// 	var char = content[i];

	// 	//让文字自动换行
	// 	lineWidth += context.measureText(char).width;
	// 	if (lineWidth > this.rect.width - x) {
	// 		context.fillText(content.substring(lastSubStrIndex, i), x, y);
	// 		y += threshold;
	// 		lineWidth = 0;
	// 		lastSubStrIndex = i;
	// 	}
	// 	if (i == length - 1) {
	// 		context.fillText(content.substring(lastSubStrIndex, i + 1), x, y);
	// 	}
	// }

	context.restore();
	context.closePath();
	historyObj.points=[{x:x,y:y}]
}
/**
 * 绘制马赛克
 * @param  {MouseEvent} event [鼠标事件]
 * @return {[type]} 
 */
function __drawMoasic(event) {
	var context = this.context,
	    state = this.state,
	    rect = this.rect;

	var pos = getPos(event, rect);
	__watchDrawBound.call(this,pos.x, pos.y)
	var size = state.strokeWidth * 3;

	//获取当前位置1PX的颜色值
	var data = context.getImageData(pos.x, pos.y, size, size).data;

	var r = 0,
	    g = 0,
	    b = 0;

	for (var row = 0; row < size; row++) {
		for (var col = 0; col < size; col++) {
			r += data[(size * row + col) * 4];
			g += data[(size * row + col) * 4 + 1];
			b += data[(size * row + col) * 4 + 2];
		}
	}

	r = Math.round(r / (size * size));
	g = Math.round(g / (size * size));
	b = Math.round(b / (size * size));
	var color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + state.ambiguity + ')';
	this.tempDrawObj.points.push({
		x:pos.x, y:pos.y,size:size,color:color
	});
	context.beginPath();
	context.save();
	context.fillStyle = color;
	context.fillRect(pos.x, pos.y, size, size);
	context.restore();

	__watchDrawBound.call(this,pos.x+size, pos.y+size);
}



/**
 * 拖拽重绘绘制马赛克
 */
function __drawMoasicByHistory(historyObj) {
	var context = this.context,
	    state = this.state,
		rect = this.rect;
		let newPoints=[];
		historyObj.points.forEach(element => {
		context.beginPath();
		context.save();
		context.fillStyle = element.color;
		context.fillRect(element.x-this.hmovex,element.y-this.hmovey, element.size, element.size);
		context.restore();
		newPoints.push({
			x:element.x-this.hmovex, y:element.y-this.hmovey,size:element.size,color: element.color
			})
			}
		);
		historyObj.points=newPoints;
		
}


/**
 * 切换鼠标指针
 * @return 
 */
function __toggleCanvasCursor() {
	var canvas = this.canvas;
	var cursor = void 0;
	switch (this.state.drawType) {
		case 'brush':
			cursor = 'brush';
			break;
		case 'font':
			cursor = 'font';
			break;
		case 'mosaic':
			cursor = 'mosaic';
			break;
		case 'rect':
		case 'ellipse':
			cursor = 'crosshair';
			break;
		case 'drag':
			cursor = 'drag';
			break;
		default:
			cursor = 'default';
	}
	if (cursor) {
		canvas.className = canvas.className.replace(/canvas-cursor__(\w+)/, '').trim() + (' canvas-cursor__' + cursor);
	}
}

/**
 * 保存到历史记录
 * @return  
 */
function __pushHistory() {
	this.history.push(this.context.getImageData(0, 0, this.rect.width, this.rect.height));
}
/*{
type:"",
points:[]

}*/

/**
 * 保存到历史记录
 * @return  
 */
function __pushHistoryDraws(){
	this.historyDraws.push({type:this.tempDrawObj.type,points:this.tempDrawObj.points,strokeStyle:this.tempDrawObj.strokeStyle,lineWidth:this.tempDrawObj.lineWidth});
    this.tempDrawObj==Object.create(null);
}

function __refreshDrawHistory(){
	// var self = this;
	
	this.historyDraws.forEach(element => {

		switch (element.type) {
			case 'rect':
				__drawRectByHistory.call(this,element);
				this.state.lastImageData = this.context.getImageData(0, 0,  this.rect.width,this.rect.height);
				__pushHistory.call(this);
			break;
		    case 'ellipse':
				__drawEllipseByHistory.call(this,element);
				this.state.lastImageData = this.context.getImageData(0, 0,  this.rect.width,this.rect.height);
				__pushHistory.call(this);
			break;
			case 'mosaic':
				__drawMoasicByHistory.call(this,element);
				this.state.lastImageData = this.context.getImageData(0, 0,  this.rect.width,this.rect.height);
				__pushHistory.call(this);
				break;
			case 'font':
				__drawFontByHistory.call(this,element);
				this.state.lastImageData = this.context.getImageData(0, 0,  this.rect.width,this.rect.height);
				__pushHistory.call(this);
			 	break;
			case 'brush':
			default:
				__drawBrushByHistory.call(this,element);
				this.state.lastImageData = this.context.getImageData(0, 0,  this.rect.width,this.rect.height);
				__pushHistory.call(this);
			break;
		}

	});
}

function __watchDrawBound(xa,ya){
	let x =this.rect.top+ya;
	let y =this.rect.left+xa;
	if(this.bound){

		this.bound.minX>x&&(this.bound.minX=x)

		this.bound.maxX<x&&(this.bound.maxX=x)
	
		this.bound.minY>y&&(this.bound.minY=y)
	
		this.bound.maxY<y&&(this.bound.maxY=y)
	}else{
		this.bound={minX:x,maxX:x,minY:y,maxY:y}
		// this.bound={minX:rect.right,maxX:rect.left,minY:rect.bottom,maxY:rect.top}
	}
	


	// this.bound={minX:0,maxX:0,minY:0,maxY:0}

}
/**
 * CanvasTools
 * Class
 */

var CanvasTools = function () {

	/**
  * constructor
  * @param  {CanvasElement} canvas  [canvas element object]
  * @param  {Object} options [config]
  * @return {Object}         [instance]
  */
	function CanvasTools(canvas, options) {
		_classCallCheck(this, CanvasTools);

		if (!canvas || typeof canvas.getContext !== 'function') {
			throw new Error('invalid canvas object');
		}
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.config = _utils2.default.extend({}, defaults, options || {});
		this.tempDrawObj=Object.create(null);
        this.historyDraws=[];
		this.history = [];
		this.hmovex = 0;
		this.hmovey = 0;
		this.state = Object.create(null);
		this.rect = Object.create(null);
		this._handles = Object.create(null);
      
		this.state.strokeWidth = STROKE_DEFAULT_WIDTH;
		this.state.fontSize = TEXT_HELPER_FONT_SIZE;
		this.state.strokeColor = STROKE_DEFAULT_COLOR;
		this.state.ambiguity = AMBIGUITY_LEVEL;
		// this.state.drawType = 'brush';
		this.state.drawType = 'drag';
		this.state.isEntry = false;

		this.rect.width = canvas.width;
		this.rect.height = canvas.height;

		this.rect.offsetWidth = canvas.offsetWidth;
		this.rect.offsetHeight = canvas.offsetHeight;

		var rect = canvas.getBoundingClientRect();
		this.rect.top = rect.top;
		this.rect.left = rect.left;
	
		//保存现场
		this.state.lastImageData = this.context.getImageData(0, 0, this.rect.width, this.rect.height

		//将画布的初始状态保存到历史记录
		);__pushHistory.call(this);

		__toggleCanvasCursor.call(this);

		this.render();
	}

	/**
  * 初始化工具条到DOM
  * @return
  */


	_createClass(CanvasTools, [{
		key: 'render',
		value: function render() {
			var C = this.config;
			var S = this.state;
			var el = document.createElement('div');
			el.className = 'canvas-tools';
			el.innerHTML = _template2.default.getButtons(C.buttons);
			C.container.appendChild(el);

			this.$el = el;
			this.$el.appendChild(buildStrokePanel(S.strokeWidth, S.strokeColor));
			this.$el.appendChild(buildFontPanel(S.fontSize, S.strokeColor));
			this.$el.appendChild(buildAmbiguityPanel(S.strokeWidth, S.ambiguity));
			__bindEvents.call(this);
		}
	}, {
		key: 'refresh',
		value: function refresh() {}

		/**
   * destory
   * @return 
   */

	}, {
		key: 'destory',
		value: function destory() {
			var canvas = this.canvas,
			    $el = this.$el,
			    _handles = this._handles;


			var $btns = _utils2.default.$('.js-btn', $el),
			    $colors = _utils2.default.$('.js-color', $el),
			    $strokeWidth = _utils2.default.$('.js-stroke-width', $el),
			    $fontSize = _utils2.default.$('.js-font-size', $el),
			    $mosaicAmbiguity = _utils2.default.$('.js-mosaic-ambiguity', $el),
			    $textHelper = document.getElementById(TEXT_HELPER_ID);

			_utils2.default.$off($btns, 'click', _handles.btnEmit);
			_utils2.default.$off($colors, 'click', _handles.toggleColor);
			_utils2.default.$off($strokeWidth, 'click', _handles.toggleStrokeWidth);
			_utils2.default.$off($fontSize, 'change', _handles.toggleFontSize);
			_utils2.default.$off($mosaicAmbiguity, 'change', _handles.toggleAmbiguity);
			_utils2.default.$off(canvas, 'mousedown', _handles.onMouseDown);
			_utils2.default.$off(canvas, 'click', _handles.insertTextHelper);
			_utils2.default.$off(document, 'click', _handles.removeTextHelper);
			window.removeEventListener('resize', _handles.resize);
			$textHelper && $textHelper.parentNode.removeChild($textHelper);
			this.canvas = null;
			this.context = null;
			this.history.length = 0;
			this.config.container.removeChild(this.$el);
		}
	}
    ,{
		key: 'refreshSize',
		value: function refreshSize(canvas,hmovex,hmovey,isNewDraw) {
			if (!canvas || typeof canvas.getContext !== 'function') {
				throw new Error('invalid canvas object');
			}
			this.canvas = canvas;
			this.context = canvas.getContext('2d');
			this.rect.width = canvas.width;
			this.rect.height = canvas.height;
	
			this.rect.offsetWidth = canvas.offsetWidth;
			this.rect.offsetHeight = canvas.offsetHeight;
			this.hmovex = hmovex;
			this.hmovey = hmovey;
			var rect = canvas.getBoundingClientRect();
			this.rect.top = rect.top;
			this.rect.left = rect.left;
			if(isNewDraw){this.state.drawType = 'drag';this.bound={minX:0,maxX:0,minY:0,maxY:0}};
			//保存现场
			this.state.lastImageData = this.context.getImageData(0, 0, this.rect.width, this.rect.height);
			this.history.length = 0;
			//将画布的初始状态保存到历史记录
			__pushHistory.call(this);
			__toggleCanvasCursor.call(this);
			__refreshDrawHistory.call(this);
		}
	}]);

	return CanvasTools;
}();

exports.default = CanvasTools;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=canvastools.js.map