/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("webcore/data-backend/OfflineDataBackend",["../Multimap","../applicative","../file-helpers","../file-transfer","../guid","../monad","../StringSet","./_DataBackend","../Task","../task-helpers","../url-helpers","mendix/lang","mendix/lib/MxObject","mendix/logger"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e){var _f={"String":"","Integer":"0","Long":"0","Decimal":"0","Float":"0","Currency":"0","Enum":"","HashString":"","ObjectReference":"","DateTime":null,"Boolean":false,"AutoNumber":"0","Binary":""};var _10={"String":String,"Integer":String,"Long":String,"Decimal":String,"Float":String,"Currency":String,"Enum":String,"HashString":String,"ObjectReference":String,"DateTime":_11,"Boolean":_12,"AutoNumber":null,"Binary":String};function _13(_14,_15,_16){_16=_16||{};this._store=_14;this._createCache={};this._guidMap={};this._getStorageDir=_16.getStorageDirFn||_17;this._getDocumentUrl=_16.getDocumentUrlFn||_18;this._downloadFileFn=_16.downloadFileFn||_19;this._fetchConfig=_15;};_13.prototype=new _8();_13.prototype.getByGuid=function(_1a,_1b,_1c,_1d){var _1e=_1a.map(this._getByGuid.bind(this));var _1f=_2.sequence(_1e,_9).map(function(_20){return _20.map(_37);}).map(function(_21){return {mxobjects:_21};});_a.callbackFromTask(_1f,_1c,_1d);};_13.prototype.getSlice=function(_22,_23,_24){_23=_23||[];var _25=_23.map(_26.bind(this));return this._store.getSlice(_22,_25,_24).spread(function(_27,_28){var _29=_27.map(function(obj){if(this._isStoredLocalGuid(obj.guid)){this._guidMap[obj.guid]=_5.create();}Object.keys(obj).filter(function(_2a){return !_d2(_2a);}).filter(function(_2b){var _2c=window.mx.meta.getEntity(obj.$objectType);return _2c.isReference(_2b);}).forEach(function(_2d){if(this._isStoredLocalGuid(obj[_2d])){this._guidMap[obj[_2d]]=_5.create();}},this);return this._makeObjectExternal(obj);},this).map(_37);return {mxobjects:_29,count:_28};}.bind(this));function _26(_2e){var _2f=mx.meta.getEntity(_22);if(!_2f.isReference(_2e.attribute)){return _2e;}_2e.value=this._getInternalGuid(_2e.value);return _2e;};};_13.prototype.create=function(_30,_31,_32,_33){var _34=_5.create();var _35=mx.meta.getEntity(_30);this._guidMap[_34]=_34;this._createCache[_34]=Object.assign({guid:_34,$objectType:_30,$readonlyAttrs:[]},_36(_35));if(_32){_32({mxobject:_37(this._createCache[_34])});}};_13.prototype.commit=function(_38,_39,_3a,_3b,_3c,_3d,_3e){_39=_39||{};var _3f=_38.some(function(_40){var _41=_40 in _39;var _42=_40 in this._createCache;return _41||_42;},this);if(!_3f){if(_3d){_3d();}return;}var _43=Object.keys(_39).filter(function(_44){return !this._createCache[_44];}.bind(this));var _45=_43.map(this._getByGuid.bind(this));var _46=_2.sequence(_45,_9);var _47=_46.map(function(_48){var _49=Object.keys(this._createCache).map(function(_4a){return this._createCache[_4a];}.bind(this));var _4b=_49.concat(_48);var _4c=_4b.map(function(obj){return [obj.guid,Object.assign({},obj,_39[obj.guid])];});return _c.objectFromArray(_4c);}.bind(this));var _4d=_47.chain(function(_4e){var _4f=_38.map(function(_50){var _51=_4e[_50];return this._makeObjectInternal(_51);},this);var _52=_7.fromArray(_38);var _53=_52.chain(function(_54){return this._calculateAutoCommitGuids(_54,_4e);}.bind(this)).minus(_52).values();var _55=_53.map(function(_56){return this._makeObjectInternal(_4e[_56]);},this);var _57=this._store.insertOrReplace(_4f,_55);return _a.taskFromPromise(_57);}.bind(this));_a.callbackFromTask(_4d,function(){_38.forEach(function(_58){delete this._createCache[_58];},this);if(_3d){_3d();}}.bind(this),_3e);};_13.prototype.rollback=function(_59,_5a,_5b,_5c){_59.forEach(function(_5d){delete this._createCache[_5d];},this);var _5e=_59.map(function(_5f){var _60=this._getInternalGuid(_5f);var _61=_a.taskFromPromise(this._store.getByGuid(_60));return _61.map(function(_62){if(_62.$autocommitted===1){return _63(_62,_64.call(this,_60),_65.call(this,_62.$objectType,_60));}else{return _63(_62);}}.bind(this));},this);var _66=_2.sequence(_5e,_9).map(function(_67){return _67.reduce(_68,_69());}).chain(function(_6a){var aci=_6a.get();var _6b=_2.sequence_(aci.updateTasks,_9);var _6c=_2.sequence_(aci.deleteTasks,_9);return _6.sequence_([_6b,_6c],_9).map(function(){return aci.internalObjs.map(this._makeObjectExternal,this).map(_37);}.bind(this));}.bind(this)).map(function(_6d){return {mxobjects:_6d};});_a.callbackFromTask(_66,_5b,_5c);function _63(obj,_6e,_6f){return _1.fromObject({internalObjs:[obj],updateTasks:[_6e||_9.of()],deleteTasks:[_6f||_9.of()]});};function _69(){return _1.fromObject({internalObjs:[],updateTasks:[],deleteTasks:[]});};function _65(_70,_71){return this._store.deleteObject(_70,_71);};function _64(_72){return this._store.fetchDirty().chain(function(_73){var _74=_107(_73.map(function(_75){var _76=window.mx.meta.getEntity(_75.$objectType);var _77=_76.getReferenceAttributes().filter(function(_78){return _75[_78]===_72;});if(_77.length>0){_77.reduce(function(acc,_79){acc[_79]="";return acc;},_75);return [this._store.updateObject(_75.$objectType,_75)];}else{return [];}},this));return _2.sequence_(_74,_9);}.bind(this));};function _68(x,y){return x.concat(y);};};_13.prototype.release=function(_7a){};_13.prototype.saveDocument=function(_7b,_7c,_7d,_7e,_7f,_80,_81){var _82=this;var _83="files/documents/"+_84(this._getInternalGuid(_7b));var _85=_86(_7f,_7e.maxFileSize,_83,{create:true}).chain(function(){var _87=Object.assign({},_7c);_87[_7b]=Object.assign(_87[_7b]||{},{"HasContents":true});return new _9(function(_88,_89){_82.commit([_7b],_87,null,null,null,_89,_88);});});_a.callbackFromTask(_85,_80,_81);function _86(_8a,_8b,_8c,_8d){if(_8a.size/(1024*1024)>_8b){_9.rejected(new Error("File too large"));return;}return new _9(function(_8e,_8f){_82._getStorageDir(_8f,_8e);}).chain(function(_90){var _91=_8c.split("/");var _92=_91.pop();return _3.openDirectory(_90,_91).chain(function(de){return _3.createFileTask(de,_92,_8d).chain(function(fe){return _3.createWriterTask(fe).chain(function(fw){return _3.createWriteTask(fw,_7f);});});});});};};_13.prototype.reset=function(){return this._store.resetDatabase().map(function(){});};_13.prototype.upload=function(_93){var _94=this;return this._store.upload(_93).chain(function(_95){return _96(_95).chain(function(_97){return _9f(_95,_97).chain(function(){_a6.call(_94,_97);var _98=_ab(_95);return _94._createGetStorageDirTask().map(function(_99){return _e7(_93,_99,_97,_98);});});});});function _96(_9a){var _9b=_9a.map(function(_9c){var _9d=_f2(_93,_9c.$objectType);return _9d.map(function(_9e){return [_9c.guid,_9e.guid];});});return _2.sequence(_9b,_9).map(_c.objectFromArray);};function _9f(_a0,_a1){var _a2=_a0.map(function(_a3){return _a1[_a3.guid];});var _a4=_c.objectFromArray(_a0.map(function(_a5){return [_a1[_a5.guid],_103(_a1,_a5)];}));return _f8(_93,_a2,_a4);};function _a6(_a7){Object.keys(_a7).forEach(function(_a8){var _a9=_a7[_a8];var _aa=this._guidMap[_a8];this._guidMap[_a9]=_aa;delete this._guidMap[_a8];},this);};function _ab(_ac){return _ac.filter(function(_ad){var _ae=window.mx.meta.getEntity(_ad.$objectType);return _ae.isA("System.FileDocument")&&_ad.HasContents;}).map(function(_af){return _af.guid;});};};_13.prototype.download=function(){var _b0=_2.sequence(this._fetchConfig.map(function(_b1){return _e1(_b1.xpath).map(function(_b2){var _b3=_b2.map(_112);var _b4=_b3.map(_b5.bind(this));return {fileDownloadTaskPairs:_b4,rebuildPairsList:[_b1.store,_b2.map(_10f)]};}.bind(this));}.bind(this)),_9);return _b0.chain(function(_b6){var _b7=_b6.map(function(_b8){return _b8.fileDownloadTaskPairs;});var _b9=_b6.map(function(_ba){return _ba.rebuildPairsList;});return this._store.rebuildDatabase(_b9).map(function(){var _bb=_c.objectFromArray(_107(_b7));return _bb;});}.bind(this));function _b5(_bc){var _bd=[];var _be=_bc.getGuid();var _bf=_bc.get2("changedDate");if(_bc.isA("System.FileDocument")&&_bc.get2("HasContents")){_bd.push(this._createFileTransferTask(_b.getDynamicResourcePath(_be,_bf),"documents/"+_be));if(_bc.isA("System.Image")){_bd.push(this._createFileTransferTask(_b.getDynamicResourcePath(_be,_bf,true),"thumbnails/"+_be));}}return [_be,_2.sequence_(_bd,_9)];};};_13.prototype.cleanupDirtyObjects=function(){return this._store.cleanupDirtyObjects();};_13.prototype.getDocumentUrl=function(_c0,_c1,_c2){return this._getDocumentUrl(_84(this._getInternalGuid(_c0)),_c1,_c2);};_13.prototype._createGetStorageDirTask=function(){return new _9(function(_c3,_c4){this._getStorageDir(_c4,_c3);}.bind(this));};_13.prototype._createFileTransferTask=function(src,dst){return new _9(function(_c5,_c6){this._downloadFileFn(src,dst,_c6,_c5);}.bind(this));};_13.prototype._getByGuid=function(_c7){var _c8=this._store.getByGuid(this._getInternalGuid(_c7));var _c9=_a.taskFromPromise(_c8);return _c9.map(this._makeObjectExternal.bind(this));};_13.prototype._getInternalGuid=function(_ca){for(var ig in this._guidMap){if(this._guidMap[ig]===_ca){return ig;}}return _ca;};_13.prototype._getExternalGuid=function(_cb){return this._guidMap[_cb]||_cb;};_13.prototype._makeObjectInternal=function(_cc){return this._remapGuidsInObject(_cc,this._getInternalGuid.bind(this));};_13.prototype._makeObjectExternal=function(_cd){return this._remapGuidsInObject(_cd,this._getExternalGuid.bind(this));};_13.prototype._remapGuidsInObject=function(obj,_ce){return Object.keys(obj).reduce(function(acc,_cf){var _d0=window.mx.meta.getEntity(obj.$objectType);var _d1=_cf==="guid"||!_d2(_cf)&&_d0.isReference(_cf);acc[_cf]=_d1?_ce(obj[_cf]):obj[_cf];return acc;},{});};_13.prototype._isStoredLocalGuid=function(_d3){return /^GUID:/.test(_d3)&&this._guidMap[_d3]==null;};_13.prototype._getReferenceGuids=function(_d4,_d5){var obj=_d5[_d4];var _d6=window.mx.meta.getEntity(obj.$objectType);var _d7=_d6.getReferenceAttributes().map(function(_d8){return obj[_d8];}).filter(function(_d9){return _d9!=null&&_d9!==""&&_d9 in _d5;},this);return _7.fromArray(_d7);};_13.prototype._calculateAutoCommitGuids=function(_da,_db){var _dc=this;var _dd=_7.empty();var _de=this._getReferenceGuids(_da,_db);while(_dd.length()!==_de.length()){var _df=_de.reduce(function(acc,_e0){return acc.or(_dc._getReferenceGuids(_e0,_db));},_7.empty());_dd=_de;_de=_de.or(_df);}return _de;};return _13;function _e1(_e2){return new _9(function(_e3,_e4){window.mx.server.request({request:{action:"retrieve_by_xpath",params:{xpath:_e2,schema:{}}},options:{callback:function(_e5,_e6){_e4(_e6.mxobjects||[]);},error:_e3}});});};function _e7(_e8,_e9,_ea,_eb){var _ec=_eb.map(function(_ed){var _ee=_84(_ed);var _ef=_3.openDirectory(_e9,"files/documents").chain(function(de){return _3.createFileTask(de,_ee,{create:false});}).chain(_3.createGetFileBlobTask).chain(_3.createReadAsArrayBufferTask);var _f0=_ef.chain(function(ab){return _f1(_e8,_ea[_ed],{},new Blob([ab]));});return [_ed,_f0];});return _c.objectFromArray(_ec);};function _f2(_f3,_f4){return new _9(function(_f5,_f6){return _f3.create(_f4,false,_f6,_f5);}).map(function(_f7){return _f7.mxobject;});};function _f8(_f9,_fa,_fb){return new _9(function(_fc,_fd){_f9.commit(_fa,_fb,null,null,null,_fd,_fc);});};function _f1(_fe,_ff,_100,blob){return new _9(function(_101,_102){_fe.saveDocument(_ff,{},null,_100,blob,_102,_101);});};function _103(_104,_105){var meta=window.mx.meta.getEntity(_105.$objectType);var _106=meta.getAttributes().filter(meta.isSyncable.bind(meta));return _c.objectFromArray(_107(_106.map(function(attr){var _108=meta.getAttributeType(attr);var _109=_10[_108];if(!_109){return [];}if(meta.isReference(attr)){var _10a=_105[attr];var _10b=_104[_10a];if(_10b){return [[attr,_109(_10b)]];}else{return [[attr,_109(_10a)]];}}else{return [[attr,_109(_105[attr])]];}})));};function _37(obj){var _10c=Object.keys(obj).filter(function(_10d){return !_d2(_10d);}).reduce(function(acc,key){acc[key]={value:obj[key]===null?"":obj[key],readonly:obj.$readonlyAttrs.indexOf(key)!==-1};return acc;},{});return {guid:obj.guid,objectType:obj.$objectType,attributes:_10c};};function _d2(_10e){return (_10e==="guid"||_10e==="$objectType"||_10e==="$readonlyAttrs");};function _10f(_110){var _111={guid:_110.guid};for(var key in _110.attributes){_111[key]=_110.attributes[key].value;}return _111;};function _112(obj){return new _d({json:obj,meta:window.mx.meta.getEntity(obj.objectType)});};function _36(meta){return meta.getAttributes().reduce(function(acc,attr){acc[attr]=_113(meta,attr);return acc;},{});};function _113(meta,attr){var _114=meta.getAttributeType(attr);return _f[_114];};function _19(src,dst,_115,_116){_4.downloadFile(_b.getStaticResourceUrlFromPath(src),{location:window.TEMPORARY,path:"files/"+dst},_115,_116);};function _107(a){return [].concat.apply([],a);};function _17(_117,_118){_3.getFileSystem(window.TEMPORARY).then(function(fs){if(_117){_117(fs.root);}},_118);};function _18(_119,_11a,_11b){var dir=_11b?"thumbnails":"documents";return "filesystem:"+window.mx.appUrl+"temporary/files/"+dir+"/"+_119+"?"+(+new Date());};function _84(guid){return guid.replace(/:/g,"_");};function _11(d){if(d==null){return "";}else{return String(d);}};function _12(b){return String(!!b);};});