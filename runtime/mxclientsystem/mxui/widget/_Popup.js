/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/widget/_Popup",["mxui/widget/_WidgetBase","mxui/mixin/_Floatable","mxui/lib/Moveable","mxui/lib/Resizable","mxui/lib/popupManager","mxui/dom","dojo/keys","dojo/window","dojo/dom-style","dojo/dom-geometry","dojo/_base/fx","dojo/_base/lang","dojo/_base/declare"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){var _e=_d([_1,_2],{delay:200,_mover:null,_resizer:null,_prevBox:null,_maximized:false,_visible:false,_minWidth:300,_minHeight:200,_margin:20,getLayerName:function(){return "popup";},getPositionName:function(){return "stack";},buildRendering:function(){this.capture(this.domNode,"mousedown",function(){_5.focus(this);});this.domNode.setAttribute("tabindex",-1);this.connect(this.domNode,"keyup",function(e){if(e.keyCode===_7.ESCAPE&&e.target.nodeName!=="SELECT"){this.onClose();}});},postCreate:function(){this.createBackgroundIframe();this._mover=new _3(this.domNode,{handle:this._headerNode,margin:this._margin,delay:5});this.connect(this._mover,"onMoveStart",function(e){if(this._maximized){var _f=this._prevBox;this.resize({l:e.pageX-_f.w/2,w:_f.w,h:_f.h});}});_5.add(this);this._setDimensions({});},show:function(_10,_11){_5.show(this,_10,_11);this.connect(window.mx.ui,"resize",function(){this.resize(null,true);});},onBeforeShow:function(){this._visible=true;var _12=_6.getNodeExtents(this.domNode);this._minWidth+=_12.w;this._minHeight+=_12.h;if(this.resizable){this._resizer=new _4(this.domNode,{margin:this._margin,resizer:_c.hitch(this,"resize"),minWidth:this._minWidth,minHeight:this._minHeight});this.connect(this._headerNode,"dblclick",function(){this.maximize();});}},onShow:function(_13){if(this.delay){_b.fadeIn({node:this.domNode,duration:this.delay,onEnd:_13}).play();}else{_9.set(this.domNode,"opacity",1);_13();}},onAfterShow:function(){},hide:function(_14){_5.hide(this,_14);},onHide:function(_15){if(this.delay){_b.fadeOut({node:this.domNode,duration:this.delay,onEnd:_15}).play();}else{_15();}},center:function(){var _16=this.domNode,box=_a.getMarginBox(_16),_17=_8.getBox();_9.set(_16,{top:Math.max(0,0.7*(_17.h/2-box.h/2))+"px",left:Math.max(0,_17.w/2-box.w/2)+"px"});},maximize:function(_18){if(this._maximized&&!_18){this._maximized=false;this.resize(this._prevBox);}else{var _19=_8.getBox(),box=_18?this._prevBox:_a.getMarginBox(this.domNode);this.resize({t:0,l:0,w:_19.w,h:_19.h});this._prevBox=box;this._maximized=true;}},_setDimensions:function(box){var _1a=this._getMaximumSize(),_1b=_c.mixin(_a.getMarginBox(this.domNode),box);if(_1b.w>_1a.w){box.w=_1a.w;}if(_1b.h>_1a.h){box.h=_1a.h;}if(box.w){this.domNode.style.width=box.w+"px";}if(this._visible){if(box.h){this.domNode.style.height=box.h+"px";}if(box.w||box.h){this.layout();}}},resize:function(box,_1c){if(!this._visible){return;}if(this._maximized){if(_1c){this.maximize(true);return;}else{this._maximized=false;}}box=box||{};this._setDimensions(box);if(box.l){this.domNode.style.left=box.l+"px";}if(box.t){this.domNode.style.top=box.t+"px";}this.moveIntoView();},moveIntoView:function(){_6.moveIntoView(this.domNode,this._margin);},uninitialize:function(){this._mover.destroy();if(this._resizer){this._resizer.destroy();}},_getMaximumSize:function(){var _1d=_8.getBox();return {w:_1d.w-this._margin*2,h:_1d.h-this._margin*2};}});return _e;});