/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/Client",["mxui/sys/Parser","mxui/sys/UI","mendix/sys/Data","mendix/sys/Meta","mendix/sys/Remote","mendix/sys/Server","mendix/sys/Session","mendix/lang","mendix/logger","webcore/sql/Store","dojo/cookie","dojo/aspect","dojo/_base/array","dojo/_base/lang"],function(_1,UI,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){function _e(_f){_f=_f||{};var _10=this,_11="mendix.Client",_12=false,_13=[];this.appUrl=_f.appbase||_14();this.remoteUrl=_f.remotebase||this.appUrl;this.baseUrl=_f.xasbase||(this.remoteUrl+"xas/");this.modulePath=_f.modulePath||"../../widgets/";this.server=new _5(_d.mixin({timeout:_f.timeout},_f.server));this.session=new _6();this.remote=new _4();this.meta=new _3();this.data=new _2(_f.data);this.ui=new UI(_f.ui);this.parser=new _1();_15();function _14(){var _16=window.location.href,_17=_16.indexOf("#");if(_17!=-1){_16=_16.slice(0,_17);}return _16.slice(0,_16.lastIndexOf("/")+1);};function _18(_19){_10.ui.startup(function(){_10.parser.startup(_19);});};this.toString=function(){return _11;};this.isLoaded=function(){return _12;};this.addOnLoad=function(fnc){_12?fnc():_13.push(fnc);};this.reload=function(){};this.redirect=function(_1a){};this.startup=function(){if(_12){throw new Error("Client has already been started up!");}this.session.authorized({params:{offline:_f.offline||false},no:function(_1b){var _1c=_1b&&_7.inArray(_1b.http_code,["402","404","500","503"])?_1b.http_code:0;var _1d=_29("reloginReason");_10.ui.showLogin(_1d||_1c);},yes:function(_1e){_10.meta.startup();var _1f=mx.session.getConfig("sync_config");var _20=_f.store||{};if(_1f){_10.data.setOfflineStore(new _9(_1f.schema,_20.createStoreFn),_1f.fetch);}_10.data.startup();_10.session.startup();var _21=[];if(_1e&&_1f&&_1f.fetch){_21.push(function(_22){mx.data.synchronize(_22,function(e){mx.onError(e);if(_22){_22();}});});}_21=_21.concat([_18,_23]);_7.sequence(_21);function _23(){_12=true;while(_13.length>0){_13.shift()();}};}});};this.login=function(_24,_25,_26,_27){this.session.login({username:_24,password:_25,success:function(){if(_12){_10.reload();}else{_26&&_26();_10.startup();}},error:_27});};this.logout=function(){this.session.logout(_d.hitch(this,"reload"));};function _15(){_b.before(_10.server,"onUnauthorized",function(_28){if(_28=="401"){_28="419";}_a("reloginReason",_28,{expires:10/(24*60*60)});_10.reload();});};this.onError=function(err){_8.error("Error: "+err.message);};function _29(_2a){var _2b=_a(_2a);_a(_2a,null,{expires:-1});return _2b;};};return _e;});