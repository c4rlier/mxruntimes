/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mendix/lib/MxObject",["mendix/lang","mendix/validator","mendix/logger","dojo/_base/json","dojo/_base/array","dojo/_base/lang","big/big","dojo/_base/declare"],function(_1,_2,_3,_4,_5,_6,_7,_8){var _9=_8(null,{_guid:"0",_references:null,metaData:null,jsonData:null,id:"mendix.lib.MxObject",constructor:function(_a){if(!(_a.meta&&_a.json&&_a.json.objectType)){var _b=this.metaData&&this.metaData.getEntity();throw new Error("new MxObject(): cannot create Mendix object.  Check entity access"+(_b?" for entity "+_b:""));}this.metaData=_a.meta;this.resetFromJSON(_a.json);this._guid=this.jsonData.guid;this.id+="("+this.jsonData.objectType+":"+this._guid+")";},attachReferences:function(_c){if(_c&&_c.length>0){this._references={};_5.forEach(_c,function(_d){this._references[_d.getGuid()]=_d;},this);}},resetFromJSON:function(_e){this.jsonData=_e;this._guid=this.jsonData?this.jsonData.guid:"0";if(this.jsonData&&this.metaData){for(var _f in this.jsonData.attributes){this._setAttributeValue(_f,this._convertValue(_f,this._getAttributeValue(_f)));}}},getGuid:function(){return this._guid;},hasChanges:function(){return !_1.objectIsEmpty(window.mx.data.getChanges(this._guid));},set:function(_10,_11){try{return this._setContent(_10,_11);}catch(e){throw new Error("Validate values using validator#validate(value, attr) before calling MxObject#set.");}},isReadonlyAttr:function(_12){if(this.has(_12)){return !!this.jsonData.attributes[_12].readonly;}else{if(this.metaData.has(_12)){return false;}else{return true;}}},fetch:function(_13,_14){var _15=this,obj=this,_16=null,_17;if(!_13){_17=[];}else{if(_13 instanceof Array){_17=_13.slice();}else{_17=_13.split("/");}}if(this.isA(_17[0])){_17.shift();}if(typeof _14!="function"){throw new Error(_15.id+".fetch : callback is not a function");}var _18=function(){if(_17.length===0){_14(obj);}else{if(_17.length==1){if(_16){window.mx.data.release(_16);}_14(obj.get2(_17[0]));}else{if(_16){window.mx.data.release(_16);}var ref=_17.shift(),_19=false,_1a,_1b;if(obj.isObjectReference(ref)){var _1c=obj.get2(ref);if(_1c===""){_14(null);return;}if(typeof _1c=="object"){_1a=[_1c.guid];}else{_1a=[_1c];}}else{if(obj.isObjectReferenceSet(ref)){if(_17.length==1){_19=true;var _1d=obj.get2(ref);if(_1d.length===0){_14(null);return;}if(typeof _1d[0]=="object"){_1a=[];while(_1d.length>0){_1a.push(_1d.shift().guid);}}else{_1a=_1d;}}else{throw new Error(_15.id+".fetch : "+obj+" reference set should be last reference in path");}}else{return _14(null);}}_1b=_17.shift();if(!_1b){throw new Error(_15.id+".fetch : no type specified");}if(_1a){window.mx.data.get({guids:_1a,callback:function(_1e){if(_19){if(_1e.length===0||_1e[0].isA(_1b)){_14(_1e);}else{_14(null);}}else{_16=obj=_1e[0];if(_1e.length>1){window.mx.data.release(_1e.slice(1));}if(obj){if(obj.isA(_1b)){_18();}else{_14(null);}}else{_14(null);}}},error:function(e){throw new Error(_15.id+".fetch : could not get objects with GUIDs "+_1a);}});}else{throw new Error(_15.id+".fetch : "+obj+"'s '"+ref+"' attribute is empty");}}}};_18();},get2:function(_1f){if(typeof _1f!=="string"){throw new Error(this.id+".get : parameter attr "+_1f+" is not of type String");}if(!this.metaData.has(_1f)){return null;}var _20=window.mx.data.getChanges(this._guid);var _21=(_20[_1f]!=null)?_20[_1f]:this._getAttributeValue(_1f);if(this.isDate(_1f)){var _22=this.isLocalizedDate(_1f);if(_21===""||_21==null){_21="";}else{_21=_22?Number(_21):window.mx.parser.localizeEpoch(_21);}}else{if(this.isBoolean(_1f)){if(typeof _21=="string"&&_21!==""){_21=/^true$/.test(_21);}}}if(_21 instanceof _7){return new _7(_21);}if(typeof _21=="object"){return _6.clone(_21);}return _21;},has:function(_23){if(typeof _23!=="string"){throw new Error(this.id+".has: attribute parameter is not a string");}return _23 in this.jsonData.attributes;},getReferences:function(_24){var e;if(typeof _24!=="string"){throw new Error(this.id+".getReferences : parameter attr "+_24+" is not of type String.");}var _25=[];if(this.has(_24)){if(this.isReference(_24)){var _26=window.mx.data.getChanges(this._guid);if(this._hasChildren(_24)){var _27=this.getChildren(_24);var _28=[];for(var i=0;i<_27.length;i++){_28.push(_27[i].getGuid());}_25=_28;}else{_25=this.get2(_24);}if(_25===""){_25=[];}else{if(typeof (_25)=="string"||typeof (_25)=="number"){_25=[_25];}else{if((typeof (_25)=="object")&&(_25.length==null)){_25=_1.objectToArray(_25);}}}}else{throw new Error(this.id+".getReferences: attribute "+_24+" is not an ObjectReference(Set).");}}else{}return _25;},getReference:function(_29){var e;if(typeof _29!=="string"){throw new Error(this.id+".getReference : parameter attr is not of type String.");}if(this.has(_29)){if(!this.metaData.isObjectReference(_29)){throw new Error(this.id+".getReference: attribute "+_29+" is not an ObjectReference.");}}else{return null;}if(this._hasChildren(_29)){return this.getChild(_29).getGuid();}else{return this.get2(_29);}},isEnum:function(_2a){return this.metaData.isEnum(_2a);},isNumeric:function(_2b){return this.metaData.isNumeric(_2b);},isCurrency:function(_2c){return this.metaData.isCurrency(_2c);},isPassword:function(_2d){return this.metaData.isPassword(_2d);},isDate:function(_2e){return this.metaData.isDate(_2e);},isLocalizedDate:function(_2f){return this.metaData.isLocalizedDate(_2f);},isBoolean:function(_30){return this.metaData.isBoolean(_30);},isReference:function(_31){return this.metaData.isReference(_31);},isObjectReference:function(_32){return this.metaData.isObjectReference(_32);},isObjectReferenceSet:function(_33){return this.metaData.isObjectReferenceSet(_33);},getOptions:function(_34){return this.metaData.getOptions(_34);},getEnumMap:function(_35){return this.metaData.getEnumMap(_35);},getEnumKVPairs:function(_36){return this.metaData.getEnumKVPairs(_36);},getEnumCaption:function(_37){return this.metaData.getEnumCaption(_37,this.get2(_37));},hasChildren:function(_38){if(typeof _38!=="string"){throw new Error(this.id+".hasChildren : parameter attr ("+_38+") is not of type String.");}return (this.isReference(_38)&&this._hasChildren(_38));},getChildren:function(_39){if(typeof _39!=="string"){throw new Error(this.id+".getChildren : parameter attr ("+_39+") is not of type String.");}var _3a=[],_3b=null,_3c;if(this.has(_39)){if(this.isReference(_39)){if(this._hasChildren(_39)){_3b=this.get2(_39);if(this.isObjectReference(_39)){if(this._references&&this._references[_3b]){_3c=this._references[_3b];_3c._references=this._references;_3a.push(_3c);}else{_3a.push(new _9({meta:window.mx.meta.getEntity(_3b.objectType),json:_3b}));}}else{for(var i in _3b){if(this._references&&this._references[_3b]){_3c=this._references[i];_3c._references=this._references;_3a.push(_3c);}else{_3a.push(new _9({meta:window.mx.meta.getEntity(_3b[i].objectType),json:_3b[i]}));}}}}}else{var e=this.id+".getChildren: attribute "+_39+" is not an ObjectReference(Set).";_3.exception(e);throw new Error(e);}}else{}return _3a;},getChild:function(_3d){if(typeof _3d!=="string"){throw new Error(this.id+".getChild : parameter attr("+_3d+") is not of type String.");}if(this.has(_3d)&&this.isObjectReference(_3d)){var _3e=this.get2(_3d);if(this._references&&this._references[_3e]){var _3f=this._references[_3e];_3f._references=this._references;return _3f;}else{if(typeof _3e=="object"){return new _9({json:_3e,meta:window.mx.meta.getEntity(_3e.objectType)});}else{return null;}}}},removeReferences:function(_40,_41){var e;if(typeof _40!=="string"){throw new Error(this.id+".removeReference : parameter attr is not of type String.");}else{if(this.has(_40)){if(!this.isReference(_40)){throw new Error(this.id+".removeReference : attempt to remove Reference from non-Reference attribute : "+_40);}}else{return false;}}if(!(_6.isArray(_41))){_41=[_41];}if(!this._hasChildren(_40)){if(this.isObjectReference(_40)){this._setContent(_40,"");}else{this._setContent(_40,_1.arraySubtract(this.getReferences(_40),_41));}}else{if(this.isObjectReference(_40)){this._setContent(_40,"");}else{for(var i=0;i<_41.length;i++){delete this.jsonData.attributes[_40].value[_41[i]];}var val=_1.arraySubtract(this.getReferences(_40),_41);return this._makeChange(_40,val);}}},addReference:function(_42,_43){var e;if(typeof _42!=="string"){throw new Error(this.id+".addReference : parameter attr is not of type String.");}else{if(!_43){throw new Error(this.id+".addReference : parameter guid is not set.");}else{if(this.has(_42)){if(!this.isReference(_42)){throw new Error(this.id+".addReference : attempt to add Reference to non-Reference attribute : "+_42);}}else{return false;}}}if(this.isObjectReference(_42)){this._setContent(_42,_43);}else{var _44=this.getReferences(_42);var _45=_44.join(";");if(!(_45.match(_43))){_44.push(_43);this._setContent(_42,_44);}}},addReferences:function(_46,_47){for(var i=0;i<_47.length;i++){var _48=_47[i];if(_48!==0&&!isNaN(_48)){this.addReference(_46,_48);}}},getReferenceAttributes:function(){return this.metaData.getReferenceAttributes();},getAttributes:function(){return this.metaData.getAttributes();},getPrimitives:function(){return this.metaData.getAttributesWithoutReferences();},getAttributeType:function(_49){return this.metaData.getAttributeType(_49);},getSelectorEntity:function(_4a){return this.metaData.getSelectorEntity(_4a);},getEntity:function(){return (this.jsonData&&this.jsonData.objectType);},isA:function(_4b){return this.metaData.isA(_4b);},hasSuperEntities:function(){return this.metaData.hasSuperEntities();},getSuperEntities:function(){return this.metaData.getSuperEntities();},hasSubEntities:function(){return this.metaData.hasSubEntities();},getSubEntities:function(){return this.metaData.getSubEntities();},inheritsFrom:function(_4c){return this.metaData.inheritsFrom(_4c);},compare:function(_4d){if(_4d.getEntity()!=this.getEntity()){return false;}var _4e=this.metaData.getAttributesWithoutReferences();for(var i=0,_4f;_4f=_4e[i];i++){var _50=this.get2(_4f);var _51=_4d.get2(_4f);if(_50!==_51){if(typeof _50=="object"){if(typeof _51!="object"){throw new Error("non matching value types for attribute "+_4f);}if(_50.valueOf&&_51.valueOf&&_50.valueOf()!==_51.valueOf()){return false;}}else{return false;}}}var _52=this.getReferenceAttributes(),ref;for(i=0,ref;ref=_52[i];i++){if((ref=="System.changedBy")||(ref=="System.owner")){continue;}var _53=_4d.getReferences(ref);var _54=this.getReferences(ref);var _55=_54.join(",");for(var j=0,id;id=_53[j];j++){if(!_55.match(id)){return false;}}}return true;},toString:function(){return this.getGuid();},_validateNumber:function(_56,_57){var _58=_2.validate(_57,this.metaData.getAttributeType(_56));if(_58!==_2.validation.OK){throw new Error("Cannot set invalid value to MxObject attribute "+_56);}},_convertValue:function(_59,_5a){if(_5a){if(this.isNumeric(_59)){if(!(_5a instanceof _7)){_5a=new _7(_5a);}this._validateNumber(_59,_5a);}}return _5a;},_setContent:function(_5b,_5c){if(typeof _5b!=="string"){throw new Error(this.id+"._setContent : parameter attr ("+_5b+") is not of type String.");}if(!this.metaData.has(_5b)){return false;}var _5d=this.get2(_5b);if(_5d==null&&_5c===""){return false;}if(this.isDate(_5b)){var _5e=this.isLocalizedDate(_5b);if(_5c!==""){if(_5e){_5c=Number(_5c);}else{_5c=window.mx.parser.delocalizeEpoch(_5c);}}}else{if(this.isPassword(_5b)){_5c=_5c.replace(/[\s\t]+$/,"").replace(/^[\s\t]+/,"");}else{if(this.isBoolean(_5b)){_5c=!!_5c;}else{if(this.isObjectReference(_5b)&&_6.isArray(_5c)){throw new Error("mendix/lib/MxObject._setContent : trying to set single object reference to multiple values");}else{if(this.isObjectReferenceSet(_5b)&&!_6.isArray(_5c)){throw new Error("mendix/lib/MxObject._setContent : trying to set object reference set to single value");}}}}}if(_5c!==_5d){return this._makeChange(_5b,_5c);}},_hasChildren:function(_5f){var _60=window.mx.data.getChanges(this._guid);if(_60[_5f]!=null){return false;}var _61=this._getAttributeValue(_5f);if(this._references&&this._references[_61]){return true;}return (_61&&(typeof _61=="object")&&(_61.length==null));},_getAttributeValue:function(_62){var val=this.jsonData.attributes[_62];if(val===undefined){val=null;}return (val&&(typeof val=="object")&&("value" in val))?val.value:val;},_setAttributeValue:function(_63,_64){var val=this.jsonData.attributes[_63];if(_64===undefined){_64=null;}if(val&&(typeof (val)=="object")&&"value" in val){val.value=_64;}else{this.jsonData.attributes[_63]=_64;}},_makeChange:function(_65,_66){window.mx.data.makeChange(this._guid,_65,this._convertValue(_65,_66));window.mx.data.updateMxObjectSubscribers(this._guid,_65,this.get(_65));},_applyChangeSet:function(_67){if(!_67){return;}for(var _68 in _67){this._setAttributeValue(_68,_67[_68]);}}});return _9;});