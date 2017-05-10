/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/widget/InputReferenceSetSelector",["mxui/widget/Button","mxui/widget/_LabeledWidget","mxui/mixin/_ValidationHelper","mxui/dom","mendix/lang","dojo/dom-construct","dojo/_base/lang","dojo/_base/declare"],function(_1,_2,_3,_4,_5,_6,_7,_8){var _9=_8([_2,_3],{declaredClass:"mxui.widget.InputReferenceSetSelector",attributePath:"",datasource:null,selectForm:"",events:null,_mxObject:null,_readNode:null,_editNode:null,_selectButton:null,_assoc:"",_entity:"",_attr:"",_constraint:"",postCreate:function(){var _a=this.attributePath.split("/");this._assoc=_a[1];this._entity=_a[2];this._attr=_a[3];},buildRendering:function(){var $=_4.create;this._readNode=this.insideFormGroup?$("p",{"class":"form-control-static"}):$("label");this._readNode.innerHTML="&nbsp;";this._editNode=$("input",{type:"text",readonly:"readonly","class":"form-control"});var _b=this._selectButton=new _1({"class":"mx-referencesetselector-select-button",iconClass:"glyphicon-share-alt"});this.connect(_b,"onClick","openSelectForm");this.connect(this._editNode,"click","openSelectForm");this.domNode=$("div",{"class":"mx-referencesetselector"},_b.domNode,$("div",{"class":"mx-referencesetselector-input-wrapper"},this._editNode));},startup:function(){this.inherited(arguments);this.setupValidation(this._assoc);},onChange:function(){var ev=this.events&&this.events.change;ev&&this.validatedMicroflow(ev);},enable:function(){_6.place(this._selectButton.domNode,this.domNode,"first");this._readNode.parentNode.replaceChild(this._editNode,this._readNode);},disable:function(){this.domNode.removeChild(this._selectButton.domNode);this._editNode.parentNode.replaceChild(this._readNode,this._editNode);},checkDisabled:function(){return (this.inherited(arguments)||!this._mxObject||this._mxObject.isReadonlyAttr(this._assoc));},update:function(_c,_d){this._mxObject=_c;this.unsubscribeAll();this.setValidationObject(_c);var _e=function(_f){this.updateDisabled();this.renderObject(_f);};if(_c){this._constraint=(this.datasource.constraint||"").replace("[%CurrentObject%]",_c.getGuid());this.subscribe({guid:_c.getGuid(),callback:_7.partial(_e,null)});this.subscribe({guid:_c.getGuid(),attr:this._assoc,callback:_7.partial(_e,null)});}_e.call(this,_d);},renderObject:function(_10){var _11=this,obj=this._mxObject,_12=obj&&obj.get2(this._assoc);var _13=function(val){_11.setValue(val||"");_10&&_10();};if(_12&&_12.length){window.mx.data.get({guids:_12,callback:function(_14){var _15=[];for(var i=0,obj;obj=_14[i];i++){_15.push(window.mx.parser.formatAttribute(obj,this._attr));}_13(_15.join(", "));},error:function(e){window.mx.onError(e);_10&&_10();}},this);}else{_13();}},openSelectForm:function(){var _16=this;window.mx.data.getBacktrack(this._mxObject.getGuid(),this.datasource.constrainedBy,function(_17,_18){window.mx.ui.execute({form:_16.selectForm},{params:{selection:_16._mxObject.getReferences(_16._assoc),listViewSelectionMode:"multi",dataSourceMixin:{constraint:_18?_17+_16._constraint:"[0=1]"}},callback:function(_19){_19.listen("save",function(_1a){var _1b=_5.find(_19.getChildren(true),function(_1c){return "getSelected" in _1c;}),_1d=_1b.getSelected();_16._mxObject.set(_16._assoc,_1d);_16.renderObject();_16.onChange();_1a();});}});});},setValue:function(_1e){this._editNode.value=_1e;if(_1e){_4.text(this._readNode,_1e);}else{this._readNode.innerHTML="&nbsp;";}}});return _9;});