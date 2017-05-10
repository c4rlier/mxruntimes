/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/widget/NavigationTree",["mxui/widget/_WidgetBase","mxui/mixin/_Stateful","mxui/lib/menuAnchorFactory","mxui/dom","mendix/lang","dojo/_base/event","dojo/on","dojo/dom-class","dojo/_base/lang","dojo/_base/declare"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){var $=_4.create;function _b(_c){var _d={};_e(_c);return _d;function _e(_f){_5.forEach(_f,function(_10){_d[_10.id]=_10;_e(_10.items);});};};var _11=_a([_1,_2],{declaredClass:"mxui.widget.NavigationTree",menuID:"",_view:null,_itemMap:{},_expandedItems:{},_currentActive:null,_initialActive:null,buildRendering:function(){var _12=window.mx.ui.getMenu(this.menuID);this._itemMap=_b(_12);this._view=new _13(this,_12);this.domNode=this._view.domNode;this._view.subscribeToClick(_9.hitch(this,"_onClick"));this._expandedItems=this.getState("expandedItems",{});_5.forEach(this._expandedItems,function(_14,_15){this._view.expand(_15);},this);this._restoreSelection();this.connect(this.mxform,"onNavigation",this._restoreSelection);},_onClick:function(_16){var _17=this._itemMap[_16];if(_17.action){this._view.deactivateAll();this._view.activate(_16);this._currentActive=_16;if(typeof _17.action==="function"){_17.action();}else{window.mx.ui.execute(_17.action,{context:this.mxcontext});}}else{if(_16 in this._expandedItems){this._view.collapse(_16);delete this._expandedItems[_16];}else{this._view.expand(_16);this._expandedItems[_16]=true;}}},_restoreSelection:function(){this._currentActive=this.getState("activeItem",this._currentActive);this._initialActive=this._currentActive;this._view.deactivateAll();if(this._currentActive){this._view.activate(this._currentActive);}},storeState:function(_18){_18("expandedItems",this._expandedItems);_18("activeItem",this._initialActive);}});var _13=_a(null,{_handlerScope:null,domNode:null,constructor:function(_19,_1a){this._handlerScope=_19;this._render(_1a);},_render:function(_1b){this.domNode=$("div",{"class":"mx-navigationtree",tabindex:-1},$("div",{"class":"navbar-inner"},this._buildMenu(_1b)));},_buildMenu:function(_1c){var _1d=$("ul");_5.forEach(_1c,function(_1e){var _1f=_3.create(_1e);_8.add(_1f,"dropdown");_1f.setAttribute("data-item-id",_1e.id);var _20=$("li",_1f);_1d.appendChild(_20);if(_1e.items){_8.add(_20,"mx-navigationtree-has-items mx-navigationtree-collapsed");_20.appendChild(this._buildMenu(_1e.items));_1f.appendChild($("span",{"class":"caret"}));}},this);return _1d;},subscribeToClick:function(_21){this._handlerScope.own(_7(this.domNode,"a:click",function(e){_6.stop(e);_21(this.getAttribute("data-item-id"));}));},expand:function(_22){_8.remove(this._getItemById(_22).parentNode,"mx-navigationtree-collapsed");},collapse:function(_23){_8.add(this._getItemById(_23).parentNode,"mx-navigationtree-collapsed");},deactivateAll:function(){_5.forEach(this.domNode.querySelectorAll(".active"),function(_24){_8.remove(_24,"active");});},activate:function(_25){_8.add(this._getItemById(_25),"active");},_getItemById:function(_26){return this.domNode.querySelector("[data-item-id='"+_26+"']");}});return _11;});