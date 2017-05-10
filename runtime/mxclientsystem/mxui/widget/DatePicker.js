/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/widget/DatePicker",["mxui/widget/Button","mxui/widget/_WidgetBase","mxui/dom","dijit/focus","dijit/Calendar","dojo/sniff","dojo/i18n","dojo/dom-attr","dojo/dom-class","dojo/dom-style","dojo/dom-construct","dojo/dom-geometry","dojo/keys","dojo/_base/event","dojo/_base/lang","dojo/_base/declare"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10){var _11=_10(_2,{declaredClass:"mxui.widget.DatePicker",placeholder:"",selector:"date",format:"",_value:"",_native:false,_params:null,_calendar:null,_rescon:null,_leavecon:null,_blurcon:null,_foccon:null,_capture:null,_chgcon:null,_inputPos:null,_inputNode:null,_inputPane:null,_calButton:null,_calUpdateOn:true,buildRendering:function(){var $=_3.create,_12=":)",_13=this.selector=="datetime"?"datetime-local":this.selector,_14;var _15=this._inputPane=$("div",{"class":"mx-dateinput-input-wrapper"},_14=this._inputNode=$("input",{"class":"form-control mx-dateinput-input",type:_13,value:_12,placeholder:this._getPlaceholder()}));this.domNode=$("div",{"class":"mx-dateinput"},_15);this._native=_6("mobile")&&_14.type===_13&&_14.value!==_12;_14.value="";this._params={selector:this.selector=="custom"?"date":this.selector,datePattern:this.format};if(this._native){this._params=this._getNativeParseOpts();}else{_14.type="text";if(this._formatContainsDate()){this._calButton=new _1({"class":"mx-dateinput-select-button",iconClass:"glyphicon-calendar"});_8.set(this._calButton.domNode,"tabindex","-1");_b.place(this._calButton.domNode,_15,"before");}}},startup:function(){this.inherited(arguments);var _16=this._inputNode;this._connectChangeEvent();this._blurcon=this.connect(_16,"blur","onBlur");this._foccon=this.connect(_16,"focus","onFocus");this.connect(_16,"keyup","_handleInputKey");if(this._calButton){this.connect(this._calButton,"onClick","_handleButtonClicked");}},enable:function(){if(this._calButton){this._calButton.set("disabled",false);}_8.remove(this._inputNode,"disabled");},disable:function(){if(this._calButton){this._calButton.set("disabled",true);}_8.set(this._inputNode,"disabled","disabled");},focus:function(){_4.focus(this._inputNode);},onChange:function(){},onKeyUp:function(e){},onFocus:function(e){},onBlur:function(e){},uninitialize:function(){if(this._calendar){this._calendar.destroy();}if(this._capture){this._capture.remove();}},_formatContainsDate:function(){return (this.selector=="date"||this.selector=="datetime"||(this.selector=="custom"&&this.format.indexOf("d")!=-1&&this.format.indexOf("M")!=-1&&this.format.indexOf("y")!=-1));},_connectChangeEvent:function(){if(this._native){this._chgcon=this.connect(this._inputNode,"blur",function(){if(this._inputNode.value!=this._value){this.onChange();}});}else{this._chgcon=this.connect(this._inputNode,"change","onChange");}},_disconnectEvents:function(_17){for(var i=0,_18;_18=_17[i];++i){if(this[_18]){this.disconnect(this[_18]);this[_18]=null;}}},_showCalendar:function(){var _19=this._calendar;if(!this._isCalendarVisible()){if(!_19){_19=this._calendar=new _5(_f.mixin({datePackage:window.mx.ui.getDatePackage(),onChange:_f.hitch(this,"_handleCalendarChange")},this._calendarPatch));this.connect(this._calendar.domNode,"keyup",function(e){if(e.keyCode===_d.ESCAPE){this._hideCalendar();}});_19.domNode.style.position="absolute";document.body.appendChild(_19.domNode);}var _1a=this.get("value");if(_1a===""){_1a=new Date();}this._setCalendarValue(_1a);_19.domNode.style.display="block";this._rescon=this.connect(this.mxform,"resize","_handleResizeWindow");this._capture=_3.capture(document.body,"mousedown",_f.hitch(this,"_handleBodyClicked"));}this._handleResizeWindow();this._disconnectEvents(["_chgcon","_leavecon","_blurcon"]);_19.focus();setTimeout(_f.hitch(this,function(){this._connectChangeEvent();this._leavecon=this.connect(this._inputNode,"blur","_handleInputBlur");this._blurcon=this.connect(this._inputNode,"blur","onBlur");}),0);},_hideCalendar:function(){if(this._isCalendarVisible()){this._calendar.domNode.style.display="none";this._disconnectEvents(["_rescon","_leavecon"]);this._capture.remove();this._capture=null;this._inputPos=null;}this._disconnectEvents(["_foccon"]);this.focus();setTimeout(_f.hitch(this,function(){this._foccon=this.connect(this._inputNode,"focus","onFocus");}),0);},_handleCalendarChange:function(_1b){if(!this._calUpdateOn){return;}if(_1b.toGregorian){_1b=_1b.toGregorian();}this.set("value",this._mergeDates(_1b));this._hideCalendar();this.onChange();},_handleInputKey:function(e){this.onKeyUp(e);if(!this._calButton){return;}if(e.keyCode===_d.DOWN_ARROW){this._showCalendar();}else{if(e.keyCode==_d.ENTER||e.keyCode===_d.ESCAPE){if(this._isCalendarVisible()){e.stopPropagation();}this._hideCalendar();}else{var _1c=this.get("value");if(_1c&&this._isCalendarVisible()){this._setCalendarValue(_1c);}}}},_handleInputBlur:function(e){this._hideCalendar();},_handleBodyClicked:function(e){var _1d=function(e,_1e){var pos=_c.position(_1e.domNode);return (e.clientX>=pos.x&&e.clientX<pos.x+pos.w&&e.clientY>=pos.y&&e.clientY<pos.y+pos.h);};var _1f=[this,this._calendar,this._calendar.monthWidget,this._calendar.monthWidget.dropDown];if(e){for(var i=0,w;w=_1f[i];++i){if(_1d(e,w)){return;}}}this._hideCalendar();this.onBlur();},_handleButtonClicked:function(e){if(this._isCalendarVisible()){this._hideCalendar();}else{this._showCalendar();}},_handleResizeWindow:function(){var box=_c.position(this._inputNode,true),pos={x:box.x,y:box.y},_20=this._inputPos;if(!this.isLeftToRight()){pos.x+=box.w;}if(_20==null||pos.x!=_20.x||pos.y!=_20.y){var _21={left:pos.x+"px",top:pos.y+box.h+"px",zIndex:1000};if(!this.isLeftToRight()){var _22=_c.position(this._calendar.domNode,true);_21.left=pos.x-_22.w+"px";}_a.set(this._calendar.domNode,_21);this._inputPos=pos;}},_isCalendarVisible:function(){return this._calendar&&this._calendar.domNode.style.display!="none";},_setCalendarValue:function(_23){this._calUpdateOn=false;this._calendar.set("value",_23);this._calUpdateOn=true;},_getNativeParseOpts:function(){var _24;switch(this.selector){case "date":_24="yyyy-MM-dd";break;case "time":_24="HH:mm";break;case "datetime":_24="yyyy-MM-dd HH:mm";}return {selector:"date",datePattern:_24};},_getPlaceholder:function(){if(this.placeholder){return this.placeholder;}else{var _25=_7.getLocalization("dojo.cldr",mx.ui.getCalendarSystem()),_26;switch(this.selector){case "date":_26=_25["dateFormat-short"];break;case "time":_26=_25["timeFormat-short"];break;case "datetime":_26=_25["dateFormat-short"]+" "+_25["timeFormat-short"];break;case "custom":_26=this.format;}_26=_26.toLowerCase();return _26.replace(/(\w)+/g,function(_27,_28){switch(_28){case "y":return new Array(5).join(_28);case "a":return _25["field-dayperiod"];default:return new Array(3).join(_28);}});}},_mergeDates:function(_29){var _2a=new Date(this._value===""?window.mx.parser.localizeEpoch(0):this._value);return window.mx.parser.mergeDates(_2a,_29,this.selector);},_getValueAttr:function(){var _2b=this._inputNode.value;if(_2b===""){return "";}if(this._native){_2b=_2b.slice(0,16).replace("T"," ");}var _2c=window.mx.parser.parseValue2(_2b,"datetime",this._params);return _2c?this._mergeDates(_2c):null;},_setValueAttr:function(_2d){var _2e=window.mx.parser.formatValue(_2d,"datetime",this._params);this._inputNode.value=this._native?_2e.replace(" ","T"):_2e;this._value=_2d;},_calendarPatch:{_onDayMouseDown:function(e){var _2f=e.target.parentNode;if(_2f&&_2f.dijitDateValue!=null&&!_9.contains(_2f,"dijitCalendarDisabledDate")){this._currentNode=_2f;}},_onDayClick:function(e){_e.stop(e);for(var _30=e.target;_30&&(_30.dijitDateValue==null);_30=_30.parentNode){}if(_30&&!_9.contains(_30,"dijitCalendarDisabledDate")){this.set("value",_30.dijitDateValue);}},_patchDate:function(_31){if(_31!=null){_31=new this.dateClassObj(_31);_31.setHours(1,0,0,0);}return _31;}}});return _11;});