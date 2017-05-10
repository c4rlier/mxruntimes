/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mendix/sys/Data",["mendix/lib/ConnectionError","mendix/lib/Error","mendix/lib/ValidationError","mendix/lib/MxObject","mendix/lang","mendix/logger","webcore/data-backend/OnlineDataBackend","webcore/data-backend/OfflineDataBackend","webcore/MxObjectCache","webcore/MxObjectBackend","webcore/DanglingError","webcore/Task","webcore/applicative","webcore/task-helpers","dojo/_base/array","dojo/_base/lang"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10){function _11(_12){_12=_12||{};var _13=this,_14="mendix.sys.Data",_15={entities:{},guids:{},attrs:{},vals:{}};var _16=new _7();var _17=new _a(_16,new _9(),function(_18){return !_19(_18);});var _1a=_16;var _1b=function(_1c,_1d,map){if(!_1d){return _1c;}for(var i in map){if((i in _1d)&&(_1d[i]!=null)){_1c[i]=_1d[i];}}return _1c;};var _1e=function(_1f,_20,_21,_22){try{_1f&&_1f.apply(_20,_21||[]);}catch(e){_6.error(_14+_22+" : "+e.message+" "+(_20?"("+_20+")":""));}};var _23=function(_24,_25,e,_26){try{if(_24){_24.call(_25,e);}else{_6.error("unhandled error: "+e.message);window.mx.onError(e);}}catch(err){_6.error("error in "+_14+"."+_26+" while calling error handler: "+err.message);}};var _19=function(_27){var _28=_5.itemCount;return (_28(_15.guids[_27])||_28(_15.attrs[_27]));};var _29=function(_2a,_2b){var _2c={};_f.forEach(_2a.getAttributes(),function(ref){if(!_2a.isReference(ref)){return;}var _2d=_2b.getContext(_2a.getSelectorEntity(ref));if(_2d){_2c[ref]=_2d;}});return _2c;};var _2e=function(_2f,_30,_31,_32){var _33=_30.split("/");var _34=function(_35){var _36=_33.shift(),ref=_33.shift(),_37;if(_35==null||_35.length==null||_35.length===0){_31(null);return;}var _38=[];for(var i=0;i<_35.length;i++){if(_35[i]==null){continue;}_38.push("id='"+_35[i].getGuid()+"'");}if(!_38.length){_31(null);return;}var ids=_38.join(" or ");_37="["+ref+"/"+_36+"["+ids+"]]";if(_33.length==1){_31(_37);}else{var _39=_33[0];_36=_33.shift();ref=_33.shift();_31("["+ref+"/"+_36+""+_37+"]");}};var _3a=function(){var _3b=_33.shift(),ref=_33.shift();if(_33.length==1){var _3c="["+ref+"='"+_2f.getGuid()+"']";_31(_3c);return;}if(window.mx.meta.getEntity(_3b)==null){_23(_32,null,new _2(_14+".runMapPath: entity"+_3b+" does not exist"),"runMapPath");return;}if(!_2f.isA(_3b)){_23(_32,null,new _2(_14+".runMapPath: entity "+_2f.getEntity()+" is not a "+_3b+" or one of its subclasses"),"runMapPath");return;}if(!_2f.has(ref)){_23(_32,null,new _2(_14+".runMapPath: reference "+ref+" not found in entity "+_3b),"runMapPath");return;}if(_2f.get2(ref)!==""){_13.get({guids:_2f.getReferences(ref),callback:_34,error:_32});}else{_31(null);}};_3a();};this.getBacktrackConstraints=function(_3d,_3e,_3f,_40,_41){if(!_10.isFunction(_40)){_41=_40;_40=null;}_13.getBacktrack(_3e.getTrackId(),_3e.getConstraints(),_3f,_40,_41);};var _42=this.getBacktrackConstraints;this.getBacktrack=function(_43,_44,_45,_46,_47){if(!_10.isFunction(_46)){_47=_46;_46=null;}if(!_44||_44.length===0){_45.call(_47,"",true);return;}var _48=null,_49=[],_4a=0,_4b=true;var _4c=function(){var _4d=_44[_4a++];if(_4d){_2e(_48,_4d,function(_4e){if(_4e){_49.push(_4e);}else{_4b=false;}_4c();},function(e){_23(_46,_47,e,"getBacktrack");});}else{_45.call(_47,_49.join(""),_4b);}};if(!_43){_45.call(_47,"",false);}else{_13.get({guid:_43,callback:function(obj){_48=obj;_4c();},error:function(e){_23(_46,_47,e,"getBacktrack");}});}};var _4f=function(_50,_51){var _52=[],_53=_29(_50,_51);for(var m in _53){if(m=="System.changedBy"||m=="System.owner"){continue;}if(_50.has(m)){var _54=_50.getAttributeType(m);switch(_54){case "ObjectReference":_52.push("["+m+"='"+_53[m]+"']");break;case "ObjectReferenceSet":_52.push("["+m+"='"+_53[m]+"']");break;default:}}}return _52.join("");};var _55=function(_56){var _57=_56.entity||_56.className,_58=window.mx.meta.getEntity(_57),_59=_56.context,_5a="//"+_57,_5b=_4f(_58,_59);var _5c=function(_5d,_5e){if(_56.callback){_56.callback(_5a+_5b+_5d,_5e);}};if(_59.getConstraints().length!==0){_42(_58,_59,_5c,_56.error);}else{_5c("",true);}};var _5f=function(_60){window.mx.server.request({request:{action:"retrieve_xpath_aggregate",params:{xpath:_60.type+"("+_60.xpath+")",resulttype:_60.resulttype||"integer"}},options:{callback:function(_61,_62){var _63;if(_62){if(_60.resulttype=="float"){_63=parseFloat(_62.value).toFixed(2)||"0.00";}else{_63=_62.value||0;}}else{_63=0;}_60.callback&&_60.callback(_63);},error:function(e){_23(_60.error,null,e,"numericXPathResult");},useCache:false,preventCache:true}});};var _64=function(_65){var _66;if(_65===""){return;}else{if(_65.match(/^\[[^=\[]+=.[0-9]+./)){_66=_f.map(_65.match(/\[.+?\]/g),function(_67){_67=_67.substr(1,_67.length-2);return {ref:_67.match(/[^=]+/)[0],ref_ids:_67.match(/\d+/)[0]};});}else{_66=_f.map(_65.match(/\[.+?\]]/g),function(_68){_68=_68.substr(1,_68.length-3);var _69=_68.split("[");return {ref:_69[0].split("/")[0],ref_ids:_69[1]};});}}return _66;};this.toString=function(){return _14;};this.setOfflineStore=function(_6a,_6b){_1a=new _8(_6a,_6b,_12.offlineBackend);_17=new _a(_1a,new _9(),function(_6c){return !_19(_6c);});};this.startup=function(){window.setInterval(_10.hitch(_17,"cleanup"),10000);};this.subscribe=function(_6d,_6e){var id=_5.getUniqueId(),_6f=_6d.entity,_70=_6d.guid,val=_6d.val,_71=_6d.attr,_72=_6d.async,_73=_6e?function(){_6d.callback.apply(_6e,arguments);}:_6d.callback;var _74={handler:_73,async:_72};if(_71){if(!_15.attrs[_70]){_15.attrs[_70]={};}if(!_15.attrs[_70][_71]){_15.attrs[_70][_71]={};}_15.attrs[_70][_71][id]=_74;}else{if(val){if(!_15.vals[_70]){_15.vals[_70]={};}_15.vals[_70][id]=_74;}else{if(_70){if(!_15.guids[_70]){_15.guids[_70]={};}_15.guids[_70][id]=_74;}else{if(_6f){if(!_15.entities[_6f]){_15.entities[_6f]={};}_15.entities[_6f][id]=_74;}else{_6.error(_14+".subscribe: no 'entity' or 'guid' parameter found");}}}}return {entity:_6f,guid:_70,val:val,attr:_71,id:id};};this.unsubscribe=function(_75){if(_75==null){return;}var id=_75.id,_76=_75.entity,_77=_75.guid,val=_75.val,_78=_75.attr,_79=_5.itemCount;if(_78){var _7a=_15.attrs[_77];if(!_7a){}else{if(!_7a[_78]){}else{delete _7a[_78][id];if(_79(_7a[_78])===0){delete _7a[_78];}if(_79(_7a)===0){delete _15.attrs[_77];}}}}else{if(val){if(!_15.vals[_77]){}else{delete _15.vals[_77][id];if(_79(_15.vals[_77])===0){delete _15.vals[_77];}}}else{if(_77){var _7b=_15.guids[_77];if(!_7b){}else{delete _7b[id];if(_79(_7b)===0){delete _15.guids[_77];}}}else{if(_76){var _7c=_15.entities[_76];if(!_7c){}else{delete _7c[id];if(_79(_7c)===0){delete _15.entities[_76];}}}}}}};this.update=function(_7d){var _7e=_7d.guid,_7f=_7d.entity,_80=_7d.attr,val=_7d.val,_81=_7d.value,_82=_7d.callback;var _83=function(_84,_85,_86){var map=_84?_10.clone(_84):{};_5.collect(Object.keys(map).map(function(key){if(map[key].async){return function(cb){map[key].handler.apply(null,_85.concat([cb]));};}else{return function(cb){map[key].handler.apply(null,_85);cb();};}}),_86);};if(_80){_83(_15.attrs[_7e]&&_15.attrs[_7e][_80],[_7e,_80,_81],_82);}else{if(_7e){_83(_15.guids[_7e],[_7e],_82);}else{if(val){_83(_15.vals[_7e],[_7e],_82);}else{if(_7f){_83(_15.entities[_7f],[_7f],_82);}else{_6.error(_14+".update: no 'entity' or 'guid' parameter found");}}}}};this.objectUpdateNotification=function(_87){_13.sendClassUpdate(_87.getEntity());_13.update({guid:_87.getGuid()});};this.sendClassUpdate=function(_88,_89){var _8a=window.mx.meta.getEntity(_88);if(!_8a){throw new _2("No permission to read or write entity "+_88+", check security!");}var _8b=[_88].concat(_8a.getSuperEntities()).map(function(ent){return function(cb){_13.update({entity:ent,callback:cb});};});_5.collect(_8b,_89);};this.sendValidationUpdates=function(_8c){var _8d,_8e=[];for(var i=0,_8f;_8f=_8c[i];i++){_8d=_15.vals[_8f.getGuid()];var cp=_8f.clone(),_90=cp.getAttributes();if(_8d){for(var x in _8d){var _91=_8f.clone();try{_8d[x].handler([_91]);}catch(e){_6.error(_14+".sendValidationUpdates: trouble triggering validation update: "+e.message);delete _8d[x];}var _92=_91.getAttributes();_f.forEach(_90,function(_93){var _94=_93.name,_95=_f.some(_92,function(_96){return _96.name==_94;});if(!_95){cp.removeAttribute(_93.name);}},this);}}else{}if(cp.getAttributes().length){_8e.push(cp);}}window.mx.ui.validations(_8e);};this.action=function(_97){_17.action(_97.params,_97.context,{origin:_97.origin},!!_97.async,_97.onValidation,function(_98,_99){if(_97.callback){_97.callback(_98,_99);}},function(e){_23(_97.error,null,e,"action");});};this.setOrRetrieveMxObject=function(_9a){return _17.setOrRetrieveMxObject(_9a);};this.get=function(_9b,_9c){var _9d=_9b.xpath,_9e=_9b.path,id=_9b.guid,ids=(!("guids" in _9b)&&id)?[id]:_9b.guids,_9f=_9b.callback,_a0=_9b.error,_a1=!!_9b.noCache,_a2=!!_9b.count,_a3=_9b.filter,_a4=!!_9b.aggregates,_a5=_9b.context,_a6=_9b.microflow,err;if(("guid" in _9b)&&id==null){_1e(_9f,_9c,[null],"");return;}if(!_9d&&!ids&&!_a6){err=_14+".get: xpath, guid|guids and microflow arguments are undefined";_6.error(err);throw new _2(err);}if(_9e&&ids.length!=1){throw new _2(_14+".get : path can only be used with a single guid");}if(typeof _9f!="function"){err=_14+".get: callback is not a function";_6.error(err);throw new _2(err);}else{if(_a0&&typeof _a0!="function"){err=_14+".get: error is not a function";_6.error(err);throw new _2(err);}}if(_a3){if(_a3.limit){_a3.amount=_a3.limit;delete _a3.limit;}if(_a3.references){for(var r in _a3.references){var ref=_a3.references[r];if(ref.limit){ref.amount=ref.limit;delete ref.limit;}}}}var val=null,_a7=_1b({},_a3,!id?{"id":val,"attributes":val,"offset":val,"sort":val,"amount":val,"distinct":val,"references":val,"depth":val}:{"id":val}),_a8=function(e){_23(_a0,_9c,e,"get");};if(_a7.id&&ids&&!id){delete _a7.id;}if(_a7.id){delete _a7.attributes;delete _a7.distinct;}if(_a6){var _a9=ids?"selection":(_9d?"set":"none"),_aa={actionname:_a6,applyto:_a9};if(_a9=="selection"){_aa.guids=ids;}else{if(_a9=="set"){_aa.xpath=_9d;if(_a7.sort){_aa.sort=_a7.sort;}}}this.action({params:_aa,context:_a5,callback:function(_ab,_ac){_9f&&_9f.call(_9c,_ab,_ac);},error:_a8});}else{if(_9e&&ids){_17.getByPath(ids[0],_9e,_9b.entity,function(_ad,_ae){try{if(_9f){_9f.call(_9c,_ad,{count:_ae});}}catch(e){_6.error(_14+".get: error in handler for "+(id?id:"["+ids+"]")+": "+e.message+" "+(_9c?"("+_9c+")":""));}},function(e){_23(_a0,_9c,e,"get");});}else{if(ids){if(ids.length===0){_1e(_9f,_9c,[id?null:[],{count:0}],".get: error in handler");return;}_17.getByGuid(ids,_a7,!_a1,function(_af,_b0){var _b1;if(id){if(_a7.id){_b1=_f.filter(_af,function(_b2){return _b2.getGuid()===id;})[0];if(_b1===undefined){_23(_a0,_9c,new _2("Returned objects do not contain requested one"),"get");return;}}else{_b1=_af[0]||null;}}else{_b1=_af;}try{if(_9f){_9f.call(_9c,_b1,{count:_b0});}}catch(e){_6.error(_14+".get: error in handler for "+(id?id:"["+ids+"]")+": "+e.message+" "+(_9c?"("+_9c+")":""));}},function(e){_23(_a0,_9c,e,"get");});return true;}else{_17.getByXPath(_9d,_a7,_a2,_a4,function(_b3,_b4,_b5){_1e(_9f,_9c,[_b3,{count:_b4,aggregates:_b5}],".get: error in error handler for xpath "+_9d);},_a8);return true;}}}};this.getBySchema=function(_b6,_b7){var _b8=_b6.id,_b9=_b6.callback;window.mx.server.request({request:{action:"retrieve_by_id_with_schema",params:_b6},options:{callback:function(_ba,_bb){var _bc=[],_bd;_f.forEach(_bb.mxobjects,function(_be){var _bf=new _4({json:_be,meta:window.mx.meta.getEntity(_be.objectType)});if(_be.guid==_b8){_bd=_bf;}_bc.push(_bf);});_bd.attachReferences(_bc);_b9&&_b9(_bd,false);},error:function(e){_23(_b6.error,_b7,e,"getBySchema");}}});};this.getSlice=function(_c0,_c1,_c2,_c3,_c4){_17.getSlice(_c0,_c1,_c2).spread(function(_c5,_c6){if(_c3){_c3(_c5,_c6);}}).caught(function(e){if(_c4){_c4(e);}else{mx.onError(e);}});};this.fetch=function(obj,_c7,_c8,_c9,_ca){if(_10.isFunction(_c8)){_ca=_c9;_c9=_c8;}var _cb;if(!_c7){_cb=[];}else{if(_c7 instanceof Array){_cb=_c7.slice();}else{_cb=_c7.split("/");}}if(obj&&obj.isA(_cb[0])){_cb.shift();}var _cc;if(_cb.length%2==1){_cc=_cb.pop();}else{_cc="";}_17.fetch(obj,_cb,_cc,_c8,_c9,_cd);function _cd(e){_23(_ca,null,e,"fetch");};};this.release=function(_ce){if(!_ce){return;}_ce=_ce instanceof Array?_ce:[_ce];for(var i=0,len=_ce.length;i<len;++i){if(_ce[i]){_17.release(_ce[i].getGuid());}}};this.create=function(_cf,_d0){if(typeof _cf.callback!="function"){throw new _2(_14+".create: callback is not a function");}else{if(_cf.error&&typeof _cf.error!="function"){throw new _2(_14+".create: error is not a function");}else{if(typeof _cf.entity!="string"){throw new _2(_14+".create: entity is not a string");}}}_17.create(_cf.entity,_cf.persistent,function(obj){if(_cf.context){_13.setObjectToContext(obj,_cf.context);}_cf.callback.call(_d0,obj);},function(e){_23(_cf.error,_d0,e,"create");});};this.jsonToMxObject=function(_d1){return new _4({json:_d1,meta:window.mx.meta.getEntity(_d1.objectType)});};this.remove=function(_d2){var _d3=("guid" in _d2)?[_d2.guid]:_d2.guids;if(("guids" in _d2)&&!(_d2.guids instanceof Array)){throw new _2(_14+".remove: parameter guids set but not of type Array");}else{if(_d2.error&&typeof _d2.error!="function"){throw new _2(_14+".remove: parameter error set but not of type Function");}else{if(_d2.callback&&typeof _d2.callback!="function"){throw new _2(_14+".remove: parameter callback set but not of type Function");}}}_17.remove(_d3,_d2.callback,_d4);function _d4(e){_23(_d2.error,null,e,"remove");};};this.validate=function(_d5,_d6,_d7){if(_d5.length===0){if(_d6){_d6();}return;}_17.validate(_d5,_d6,_d7);};this.commit=function(_d8,_d9){var _da=_db(_d8,"commit");if(_da.length===0&&_d8.callback){_1e(_d8.callback,_d9,null,".commit: error when executing handler without object");return;}_17.commit(_da,_d8.context,_d8.store,_d8.onValidation,_dc.bind(this),_dd);function _dc(){_da.forEach(this.objectUpdateNotification,this);var _de=_da.map(function(_df){return _df.getGuid();});_1e(_d8.callback,_d9,null,".commit: error when executing handler for ["+_de.join(", ")+"]");};function _dd(e){_23(_d8.error,null,e,"commit");};};this.rollback=function(_e0,_e1){var _e2=_db(_e0,"rollback");if(_e2.length===0){_1e(_e0.callback,_e1,null,".rollback: error in handler");return;}var _e3=_e2.map(function(_e4){return _e4.getGuid();});var _e5=_5.unique(_e2.map(function(_e6){return _e6.getEntity();}));_17.rollback(_e2,_e7.bind(this),_e8);function _e7(_e9){_e9.forEach(this.objectUpdateNotification,this);_e5.forEach(function(_ea){this.sendClassUpdate(_ea);},this);_1e(_e0.callback,_e1,null,_14+".rollback: error in handler for ["+_e3.join(", ")+"]");};function _e8(e){_23(_e0.error,null,e,"rollback");};};this.synchronizeDataWithFiles=function(_eb,_ec){var _ed=this._createSynchronizeTask().chain(function(_ee){var _ef=Object.keys(_ee).map(function(_f0){return _ee[_f0];});return _d.sequence_(_ef,_c);});_e.callbackFromTask(_ed,_eb,_ec);};this.synchronizeData=function(_f1,_f2){_e.callbackFromTask(this._createSynchronizeTask(),function(_f3){if(_f1){_f1();}},_f2);};this.uploadDataWithReset=function(_f4,_f5){var _f6=this._createUploadTask().chain(function(){return _1a.reset();});_e.callbackFromTask(_f6,_f4,_f5);};this._createSynchronizeTask=function(){return this._createUploadTask().chain(function(){return _1a.download();});};this._createUploadTask=function(){return _1a.upload(_16).chain(function(_f7){var _f8=Object.keys(_f7).map(function(_f9){return _f7[_f9];});return _d.sequence_(_f8,_c);}).chain(function(){_17.clearCache();return _c.of();}).orElse(function(e){if(!(e instanceof _1)&&!(e instanceof _b)){return _1a.cleanupDirtyObjects();}else{return _c.rejected(e);}});};this.invalidateCaches=function(_fa){_17.invalidateCaches(_fa);};this.saveDocument=function(_fb,_fc,_fd,_fe,_ff,_100){_17.saveDocument(_fb,_fc,_fd,_fe,_ff,_100);};this.matchObjectsToContext=function(_101){var _102=_101.entity,_103=_101.context,_104=_101.mxobjs,_105=_101.callback,_106=[];_42(window.mx.meta.getEntity(_102),_103,function(_107){var _108=_64(_107);for(var i=0,obj;obj=_104[i];i++){var _109=0;for(var x=0,_10a;_10a=_108[x];x++){var ref=_10a.ref,_10b=_10a.ref_ids,ids=obj.getReferences(ref),_10c=false;if(ids!==false){for(var j=0;j<ids.length;j++){if(_10b.match(ids[j])){_10c=true;break;}}}_10c&&_109++;}if(_109==_108.length){_106.push(obj);}}_105(_106);});};this.createXPathString=function(_10d){var _10e=_10d.callback,_10f=_10d.entity||_10d.className,_110=_10d.context;var _111=_110&&_110.getContexts();if(!_111||_111.length===0){_10e("//"+_10f);return;}_55(_10d);};this.generateExport=function(_112){window.mx.server.request({request:{action:"export",params:_112.params},options:{callback:_112.callback,error:function(e){_23(_112.error,null,e,"generateExport");},useCache:false,async:true}});};this.setObjectToContext=function(_113,_114){if(typeof _113!="object"){throw new _2(_14+".setObjectToContext: parameter mxObj is not of type Object");}else{if(typeof _114!="object"){throw new _2(_14+".setObjectToContext: parameter context is not of type Object");}}try{var _115=_113.getAttributes();for(var e=0;e<_115.length;e++){if(_113.isReference(_115[e])){var _116=_113.getSelectorEntity(_115[e]);if((_115[e]=="System.owner")||(_115[e]=="System.changedBy")){continue;}if(_114.hasContext(_116)){_113.addReference(_115[e],_114.getContext(_116));}var meta=window.mx.meta.getEntity(_116);if(meta){if(meta.hasSubEntities()){var _117=meta.getSubEntities();for(var i=0;i<_117.length;i++){if(_114.hasContext(_117[i])){_113.addReference(_115[e],_114.getContext(_117[i]));}}}}}}}catch(err){}};this.getObjectFromContext=function(_118,_119){var _11a=_118.getObject(),_11b=_118.getTrackId();if(_11a){_119(_11a);}else{if(_11b){window.mx.data.get({guid:_11b,callback:function(obj){if(!obj){window.mx.onError("Error while fetching object with guid "+_11b);}_119(obj);},error:function(e){window.mx.onError(e);_119(null);}},this);}else{_119(null);}}};this.sumOfXPathSet=function(_11c){_11c.type="sum";_5f(_11c);};this.countOfXPathSet=function(_11d){_11d.type="count";_5f(_11d);};this.sizeOfXPathSet=function(_11e){_11e.type="count";_5f(_11e);};this.avgOfXPathSet=function(_11f){_11f.type="avg";_5f(_11f);};this.maxOfXPathSet=function(_120){_120.type="max";_5f(_120);};this.minOfXPathSet=function(_121){_121.type="min";_5f(_121);};this.makeChange=function(guid,attr,_122){_17.makeChange(guid,attr,_122);};this.getChanges=function(guid){return _17.getChanges(guid);};this.updateMxObjectSubscribers=function(guid,attr,_123){this.update({guid:guid,attr:attr,value:_123});};this.getDocumentUrl=function(guid,_124,_125){return _1a.getDocumentUrl(guid,_124,_125);};function _db(args,_126){var _127=_14+"."+_126+": ";if(typeof args!="object"){throw new _2(_127+"args is not an object");}else{if(typeof args.callback!="function"){throw new _2(_127+"callback is not a function");}else{if(args.mxobj&&!(args.mxobj instanceof _4)){throw new _2(_127+"mxobj is not a MxObject");}else{if(args.mxobjs&&!(args.mxobjs instanceof Array)){throw new _2(_127+"mxobjs is not an Array");}else{if(!args.mxobj&&!args.mxobjs||args.mxobj&&args.mxobjs){throw new _2(_127+"one of mxobj or mxobjs should be passed");}}}}}if(args.mxobj){return [args.mxobj];}else{return args.mxobjs;}};};return _11;});