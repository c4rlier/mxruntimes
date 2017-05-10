/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("mxui/widget/_Grid",["require","mxui/mixin/_Contextable","mxui/mixin/_Scriptable","mxui/mixin/_Stateful","mxui/mixin/_Pluggable","mxui/lib/overflowHelper","mxui/mixin/_ContainingSelection","mxui/mixin/_Templated","mxui/lib/MxGridConfig","mxui/widget/SearchInput","mxui/widget/Button","mxui/widget/ControlBarButton","mxui/widget","mxui/dom","mendix/lib/MxContext","mendix/lib/ValidationError","webcore/dataSourceFactory","webcore/datasource/XPathSource","mendix/logger","dojo/fx","dojo/sniff","dojo/dom-class","dojo/dom-style","dojo/dom-geometry","dojo/_base/array","dojo/_base/lang","dojo/_base/event","dijit/registry","dojo/fx/Toggler"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_1a,_1b,_1c){var _1d=_d.declare("mxui.widget._Grid",{mixins:[_8,_2,_3,_4,_5,_7],baseClass:"mx-grid",css:_d.createCSSMap("mx-grid",{pagingStatus:"paging-status",searchButton:"search-button",resetButton:"reset-button"}),entity:"",schema:"",useContext:false,customDataSource:null,dataSourceMixin:null,_previousSearchConstraints:"",pagingBarNode:null,searchNode:null,toolBarNode:null,messageNode:null,searchButton:null,resetButton:null,_dataSource:null,_gridConfig:null,_gridState:null,_metaEntity:null,_toolWidgets:null,_pagingStatusNode:null,_preserveSelection:false,_defaultButtonWidget:null,constructor:function(_1e){this._preserveSelection="selection" in _1e;},fetchMetaObject:function(){this._metaEntity=window.mx.meta.getEntity(this.entity);if(this._metaEntity==null){_13.error(this.id+": This grid has been configured for an entity the current user doesn't have access to.");return false;}return true;},setupGridConfig:function(){this._gridConfig=new _9({config:this.config,nested:this.nested});},setupGridState:function(){var _1f=this._gridConfig,_20=this._gridState;_20.updateperiod=_1f.gridSetting("refresh");_20.searchbar=_1f.gridSetting("searchbar");_20.controlbar=_1f.gridSetting("controlbar");_20.pagingbar=_1f.gridSetting("pagingbar");_20.selectionmode=_1f.gridSetting("selectionmode");_20.selectable=(_20.selectionmode!=="none");_20.editable=_1f.gridSetting("editable");_20.showemptyrows=_1f.gridSetting("showemptyrows");_20.selectfirst=_1f.gridSetting("selectfirst");},setupDataSource:function(){var _21=this._gridConfig,_22=_21.getDataSource(),_23=this.getState("pageOffset",0),_24=_21.gridSetting("pageSize"),_25;if(this.customDataSource){_25=this.customDataSource;_25.setPageSize(_24);_25.setOffset(_23);var _26=this.getState("sortOptions",_21.gridSetting("sortparams"));if(_26){_25.setSortOptions(_26[0][0],_26[0][1]);}}else{if(_22){_25=_11.create(_1a.mixin({sort:this.getState("sortOptions",_21.gridSetting("sortparams")),aggregates:"Calculations" in this._gridConfig.getPlugins(),queryid:this instanceof _1("mxui/widget/DataGrid")?this.schema:"",context:this.mxcontext,page:_24,offset:_23,useContext:this.useContext},_22,this.dataSourceMixin));}}this._dataSource=_25;},resizeGrid:function(){this.contentNode.scrollTop=0;},setUpdateInterval:function(){var _27=this._gridState.updateperiod;if(_27&&_27.toString()!="0"){this.clearInterval();this._gridState.update=setInterval(_1a.hitch(this,"reload"),parseInt(_27*1000,10));}},clearInterval:function(){if(this._gridState.update!=null){clearInterval(this._gridState.update);}},actionSelectPage:function(_28){if(!this._gridState.invertedSelection){for(var i=0,_29=this._dataSource.getObjects(),_2a;_2a=_29[i];i++){this._addToSelection(_2a.getGuid());}}this.refreshGrid();},actionSelectAllPages:function(_2b){this.selection=[];this._gridState.invertedSelection=true;this.refreshGrid();},actionClearSelection:function(_2c){if(this._hasSelection()||this._gridState.invertedSelection){this.selection=[];this._gridState.invertedSelection=false;this.refreshGrid();}},actionEditSelection:function(_2d){if(!this._hasSelection()&&!this._gridState.invertedSelection){window.mx.ui.info(window.mx.ui.translate("mxui.widget.DataGrid","no_selection"));}else{for(var i=0,obj;obj=this.selection[i];i++){var _2e=this._dataSource.getObject(obj),_2f=_2d[_2e.getEntity()];if(_2f){var _30=this.createContext();_30.dupFrom(this.mxcontext);_30.setObject(null,_2e.getEntity(),_2e.getGuid());window.mx.ui.execute(_2f,{context:_30});}}}},actionInsertNew:function(_31){var _32=this._getEntity(_31),_33=_31[_32];if(_33&&_32){window.mx.data.create({entity:_32,context:this.useContext?this.mxcontext:null,persistent:_33.persistent,callback:function(obj){if(!this.useContext){var _34=this._gridConfig.getDataSource(),_35=_34.path||"",_36=_35.split("/"),_37=this.mxcontext.getTrackId();if(_36.length==2&&_37){var _38=_36[0];if(obj.isReference(_38)){obj.set(_38,_37);}}}var _39=this.createContext();_39.setContext(obj);window.mx.ui.execute(_33,{context:_39});},error:function(e){window.mx.onError(e);}},this);}},selectRow:function(row){if(this._gridState.invertedSelection){_16.remove(row,"selected");}else{_16.add(row,"selected");}},deselectRow:function(row){if(!this._gridState.invertedSelection){_16.remove(row,"selected");}else{_16.add(row,"selected");}},postCreate:function(){var box=this.addFocusBox(this.controlNode);box.pressed({RIGHT_ARROW:box.FOCUS_NEXT,LEFT_ARROW:box.FOCUS_PREV});this.offerInterfaces(["close"]);this.initContext();this._previousSearchConstraints=this.getState("searchConstraints","");if(this.fetchMetaObject()){this.setupGridConfig();this.setupGridState();this.buildSearchBar();this.buildControlBar();this.buildToolBar();this.buildPagingBar();this.setupDataSource();}},getSchemaId:function(){return this.schema;},deselectAll:function(){this.selection=[];this.deselectGridRows();},registerSubscriptions:function(){this.removeSubscriptions();var _3a=this.mxcontext.getTrackId();if(_3a){this.subscribe({guid:this.mxcontext.getTrackId(),callback:_1a.hitch(this,"objectUpdate")});}this.subscribe({entity:this.entity,callback:_1a.hitch(this,"objectUpdate")});},eventItemClicked:function(e,_3b){if(!this._gridState.selectable){return;}var _3c=this._gridState.selectionmode,_3d=this.domData(_3b,"mendixguid"),_3e=_19.indexOf(this.selection,_3d),_3f=_3c!="singleandmaintain"||this.selection.length>1;if(_3d){var obj=this._dataSource.getObject(_3d);if(_3c=="simplemulti"||_3c=="multi"&&(_15("mac")&&e.metaKey||e.ctrlKey)){if(_3e==-1){this.selectRow(_3b);this._addToSelection(obj.getGuid());}else{if(_3f){this.deselectRow(_3b);this._removeFromSelection(obj.getGuid());}}}else{if(_3e==-1){this.deselectAll();this.selectRow(_3b);this._addToSelection(obj.getGuid());}else{if(_3f){this.deselectRow(_3b);this._removeFromSelection(obj.getGuid());}}}this._shareSelection(this._metaEntity.getEntity());}},triggerDefaultAction:function(_40){if(!this._defaultButtonWidget||!this._defaultButtonWidget.isConditionallyVisible()){return;}if(this._gridState.selectable){this.deselectAll();this.selectRow(_40);_e.clearSelection();}this._addToSelection(this._getObjectFromNode(_40).getGuid());this.eventControlBarButtonClicked(this._defaultButtonWidget.domNode);if(!this._gridState.selectable){this.deselectAll();}},eventControlBarButtonClicked:function(_41){var _42=_41.getAttribute("data-mendix-id");if(_42){var _43=this._gridConfig.getActionsByKey(_42);if(_43){if(_43.actionCall==="ActionSelected"){_43.actionCall="EditSelection";}else{if(_43.actionCall==="Create"){_43.actionCall="InsertNew";}}var _44="action"+_43.actionCall;if(this[_44]){this[_44](_43.params);}else{_13.error(this.id+".eventControlBarButtonClicked: Called function '"+_44+"' does not exist in this component");}}else{_13.error(this.id+".eventControlBarButtonClicked: Action with action key '"+_42+"' is not defined");}}else{_13.error(this.id+".eventControlBarButtonClicked: No action key defined!");}},actionInvokeAction:function(_45){this.triggerPluginEvent("invokeAction",null,_1a.hitch(this,"invokeAction",_45));},_getPlainSelection:function(){if(!this._gridState.invertedSelection){return this.selection;}var _46=this,_47=[];this._dataSource.each(function(obj){var _48=obj.getGuid();if(_19.indexOf(_46.selection,_48)===-1){_47.push(_48);}});return _47;},_getXpathSelection:function(){var _49,_4a,_4b,_4c=this._gridState.invertedSelection;if(_4c){_4b=this._dataSource.getSetSize()-this.selection.length;_49=this._dataSource.getCurrentXPath();}else{_4b=this.selection.length;_49="//"+this.entity;}if(_4b===0){return null;}var _4d=[];_19.forEach(this.selection,function(id){_4d.push("id"+(_4c?"!=":"=")+"\""+id+"\"");});if(_4d.length===0){_4a="";}else{_4a="["+_4d.join(_4c?" and ":" or ")+"]";}return {xpath:_49,constraints:_4a,sort:this._dataSource.getSortSettings()};},_getMicroflowParameters:function(_4e){var _4f={gridid:this.schema};if(!_4e){_4f.applyto="none";}else{if(_4e=="selection"){if(this._dataSource instanceof _12){var _50=this._getXpathSelection();if(!_50){return null;}_4f.applyto="selectionset";_1a.mixin(_4f,_50);}else{var _51=this._getPlainSelection();if(_51.length===0){return null;}_4f.applyto="selection";_4f.guids=_51;}}else{if(_4e=="allPages"){if(this._dataSource instanceof _12){if(this._dataSource.getSetSize()===0){_4f.applyto="none";}_1a.mixin(_4f,{xpath:this._dataSource.getCurrentXPath(),sort:this._dataSource.getSortSettings(),applyto:"set"});}else{var _52=_19.map(this._dataSource.getObjects(),function(obj){return obj.getGuid();});_4f.applyto="selection";_4f.guids=_52;}}}}return _4f;},invokeAction:function(_53){var _54=_53[this.entity],_55=_54.action,_56=this,_57=[];if(!_55){return;}if(this.actDeferSyncAction){_57.push("actDeferSyncAction");}if(_55.microflow&&_55.microflow.confirmation){var _58=_55.microflow.confirmation;_57.push(function(_59){window.mx.ui.confirmation({cancel:_58.cancel,proceed:_58.proceed,content:_58.question,handler:_59});});}if(_55.form||(_55.microflow&&_55.microflow.validate==="view")){_57.push(_1a.hitch(this.mxform,"validate"));}_57.push(function(_5a){_56.mxform.save(_5a,function(err){if(!(err instanceof mendix.lib.ValidationError)){window.mx.onError(err);}});});function _5b(){if(!(_56._destroyed||_54.maintainSelection||_56._gridState.selectionmode=="singleandmaintain")){_56.deselectAll();_56._shareSelection(_56._metaEntity.getEntity());}};if(_55.microflow){var _5c=this._getMicroflowParameters(_55.microflow.applyTo);if(!_5c){window.mx.ui.info(window.mx.ui.translate("mxui.widget.DataGrid","no_selection"));return;}_57.push(function(){window.mx.ui.execute(_55,{params:_5c,context:_56.mxcontext,store:{caller:_56},callback:_5b});});}else{var _5d=new _f();if(_55.form.passContext){var _5e=this._getPlainSelection();if(!_5e.length){window.mx.ui.info(window.mx.ui.translate("mxui.widget.DataGrid","no_selection"));return;}_5d.setTrackId(_5e[0]);_5d.setTrackEntity(this.entity);}_57.push(function(){window.mx.ui.execute(_55,{context:_5d});_5b();});}this.sequence(_57);},actionReturnSelection:function(_5f){var _60=this.mxform;_60.validate(function(){var _61=function(e){if(!(e instanceof _10)){window.mx.onError(e);}};_60.save(function(){_60.commit(function(){_60.dispose();},_61);},_61);});},controlNode:null,_setToolbarAttr:function(_62){for(var i=0,btn;btn=this._toolWidgets[i++];){btn.set("disabled",_62);}},buildControlBar:function(){if(!this._gridState.controlbar&&!this._gridState.pagingbar){this.controlNode.style.display="none";}},buildToolBar:function(){this._toolWidgets=[];if(!this._gridState.controlbar){this.toolBarNode.style.display="none";}var _63=this._gridConfig.gridTools(),box=this.getFocusBox(this.controlNode),_64=document.createDocumentFragment(),_65=this._gridConfig.getDefaultButton();for(var i in _63){var _66=_63[i];var _67={mxid:_66.mxid,caption:_66.caption,title:_66.title,onClick:_1a.hitch(this,function(e){this.eventControlBarButtonClicked(e.currentTarget);}),cssClasses:"mx-name-"+_66.name+(_66.cssClass?(" "+_66.cssClass):""),cssStyle:_66.cssStyle,alwaysHidden:_66.alwaysHidden};if(_66.iconClass){_67.iconClass=_66.iconClass;}else{if(_66.iconUrl){_67.iconUrl=_66.iconUrl;}}var _68=new _c(_67),_69=_68.domNode;if(_65&&_66.mxid===_65.mxid){this._defaultButtonWidget=_68;}_68.applyContext(this.mxcontext);this._toolWidgets.push(_68);try{if(_63[i].gridFunction){_69.setAttribute("gridFunction",_63[i].gridFunction);_69.setAttribute("param",_63[i].param);if(_63[i].background){_69.setAttribute("background-job",_63[i].background);}if(_63[i].progress){_69.setAttribute("progress",_63[i].progress);}if(_63[i].message){_69.setAttribute("message",_63[i].message);}}if(i>0){_63[i-1]._nextNode=_69;}_63[i]._domNode=_69;_64.appendChild(_69);_64.appendChild(document.createTextNode(" "));box.add(_69);_68.startup();}catch(e){}}this.toolBarNode.appendChild(_64);_e.disableSelection(this.toolBarNode);},buildPagingBar:function(){if(!this._gridState.pagingbar){this.pagingBarNode.style.display="none";return;}var ltr=this.isLeftToRight(),_6a=document.createDocumentFragment(),box=this.getFocusBox(this.controlNode),$=_e.create;this.btFirst=new _b({iconClass:ltr?"glyphicon-step-backward":"glyphicon-step-forward","onClick":_1a.hitch(this,"eventPagingFirstClicked"),"class":"mx-name-paging-first"});_6a.appendChild($("#",this.btFirst.domNode," "));box.add(this.btFirst.domNode);this.btPrevious=new _b({iconClass:ltr?"glyphicon-backward":"glyphicon-forward","onClick":_1a.hitch(this,"eventPagingPreviousClicked"),"class":"mx-name-paging-previous"});_6a.appendChild($("#",this.btPrevious.domNode," "));box.add(this.btPrevious.domNode);this._pagingStatusNode=$("div",{"class":"dijitInline "+this.css.pagingStatus});_6a.appendChild($("#",this._pagingStatusNode," "));this.btNext=new _b({iconClass:ltr?"glyphicon-forward":"glyphicon-backward","onClick":_1a.hitch(this,"eventPagingNextClicked"),"class":"mx-name-paging-next"});_6a.appendChild($("#",this.btNext.domNode," "));box.add(this.btNext.domNode);this.btLast=new _b({iconClass:ltr?"glyphicon-step-forward":"glyphicon-step-backward","onClick":_1a.hitch(this,"eventPagingLastClicked"),"class":"mx-name-paging-last"});_6a.appendChild($("#",this.btLast.domNode," "));box.add(this.btLast.domNode);this.pagingBarNode.appendChild(_6a);_e.disableSelection(this.pagingBarNode);},updatePagingStatus:function(_6b){if(!this._gridState.pagingbar){return;}var _6c=this._dataSource.getStatusMessage();_e.text(this._pagingStatusNode,_6c);if(this._dataSource.atBeginning()){this.btFirst.set("disabled",true);this.btPrevious.set("disabled",true);}else{this.btFirst.set("disabled",false);this.btPrevious.set("disabled",false);}if(this._dataSource.atEnd()){this.btNext.set("disabled",true);this.btLast.set("disabled",true);}else{this.btNext.set("disabled",false);this.btLast.set("disabled",false);}},eventPagingFirstClicked:function(){if(!this._dataSource.atBeginning()){this._dataSource.first(_1a.hitch(this,"refreshGrid"));}},eventPagingPreviousClicked:function(){if(!this._dataSource.atBeginning()){this._dataSource.previous(_1a.hitch(this,"refreshGrid"));}},eventPagingNextClicked:function(){if(!this._dataSource.atEnd()){this._dataSource.next(_1a.hitch(this,"refreshGrid"));}},eventPagingLastClicked:function(){if(!this._dataSource.atEnd()){this._dataSource.last(_1a.hitch(this,"refreshGrid"));}},_searchElements:null,_searchFilled:false,searchArgumentNode:null,searchControlNode:null,_searchGetConstraints:function(){var _6d="";var _6e=[];_19.forEach(this._searchElements,function(_6f){var _70=_6f.get("query");if(_70!==""){_6e.push(_70);}});if(_6e.length){_6d="["+_6e.join(" and ")+"]";}return _6d+this._gridState.xpathConstraint;},buildSearchBlock:function(){var $=_e.create;if(this._gridState.isSearchBuild){return;}this._gridState.isSearchBuild=true;var _71=this.searchButton=new _b({"caption":window.mx.ui.translate("mxui.widget.DataGrid",["search"]),"onClick":_1a.hitch(this,"eventSearchActivated"),"class":"btn-default mx-name-search "+this.css.searchButton});this.searchControlNode.appendChild($("#",_71.domNode," "));var _72=this.resetButton=new _b({"caption":window.mx.ui.translate("mxui.widget.DataGrid",["reset"]),"onClick":_1a.hitch(this,"eventSearchResetClicked"),"class":"btn-default mx-name-reset "+this.css.resetButton});this.searchControlNode.appendChild($("#",_72.domNode," "));var _73=document.createDocumentFragment();this._searchElements=_19.map(this._gridConfig.searchBarItems(),_1a.hitch(this,function(_74){var _75=new _a(_1a.mixin({entity:this.entity,mxcontext:this.mxcontext},_74));var _76=this.getState("searchInput",{});_75.set("value",_76[_74.path]||_75.get("value"));this.connect(_75,"onKeyUp","eventSearchActivated");_73.appendChild(_75.domNode);_75.startup();return _75;}));this.searchArgumentNode.appendChild(_73);},buildSearchBar:function(){if(!this._gridState.searchbar){this.searchNode.style.display="none";this._searchFilled=true;return;}var _77=this._gridConfig.searchBarConfig();if(_77){this._gridState.searchBarVisible=this.getState("searchBarVisible",!_77.toggledByDefault);this._gridState.searchBarTogglable=!!_77.toggleable;}else{this._gridState.searchBarVisible=true;}if(!this._gridState.searchBarVisible){var _78=false;var _79=this._gridConfig.searchBarItems();for(var i in _79){var _7a=_79[i];if(_7a.defaults){this.buildSearchBlock();_78=true;break;}}this.searchNode.style.display="none";this._gridState.isSearchBuild=_78;}else{this.buildSearchBlock();this.searchNode.style.display="";}this.checkSearchFields();},eventSearchActivated:function(e){_1b.stop(e);if(!(e.type==="click"||(e.keyCode===13&&!e.shiftKey))){return;}var _7b=this,_7c=this.searchButton;this.checkSearchFields();if(!this.constraintsFilled()){return;}_7c.set("disabled",true);this._dataSource.isValid(function(_7d){if(_7d){_7b._dataSource.setConstraints(_7b._searchGetConstraints(),function(){if(!_7b._preserveSelection){_7b.selection=[];}_7b.refreshGrid();if(_7b.triggerOnSearchChanged){_7b.triggerOnSearchChanged();}_7c.set("disabled",false);});}else{_7c.set("disabled",false);}});},eventSearchResetClicked:function(){var _7e=this._dataSource;_19.forEach(this._searchElements,function(_7f){_7f.reset();});this.checkSearchFields();_7e.setConstraints(this._searchGetConstraints());var _80=_1a.hitch(this,function(){this.refreshGrid();if(this.triggerOnSearchChanged){this.triggerOnSearchChanged();}});if(this.constraintsFilled()){_7e.isValid(function(_81){if(_81){_7e.refresh(_80);}else{_7e.clean(_80);}});}},checkSearchFields:function(){var _82=this._gridConfig.gridSetting("waitforsearch");if(!_82){this._searchFilled=true;return;}this._searchFilled=_19.some(this._searchElements,_1a.hitch(this,function(_83){if(_83.get("query")!==""){this.messageNode.innerHTML="";this.messageNode.style.display="none";return true;}}));if(!this._searchFilled){this.messageNode.innerHTML=window.mx.ui.translate("mxui.widget.DataGrid","waitForSearch");this.messageNode.style.display="block";}},constraintsFilled:function(){return this._searchFilled;},reload:function(_84){if(this.constraintsFilled()){var _85=this;this._dataSource.isValid(function(_86){if(_86){_85._dataSource.refresh(function(){_85.refreshGrid();if(_84){_84();}});}});}},actionToggleSearch:function(_87){var _88=this;if(!this._gridState.searchBarTogglable){return;}this.buildSearchBlock();this._gridState.searchBarVisible=!this._gridState.searchBarVisible;if(!this._gridState.searchBarVisible){this._searchWipeOut=this._searchWipeOut||_14.wipeOut({node:this.searchNode,duration:200,onEnd:function(){setTimeout(function(){_88.resize(_88._resizeBox);},0);_19.forEach(_88._searchElements,function(_89){_89.cleanup();});}});this._searchWipeOut.play();}else{this._searchWipeIn=this._searchWipeIn||_14.wipeIn({node:this.searchNode,duration:200,onEnd:function(){setTimeout(function(){_6.showOverflow(_88.domNode);_88.resize(_88._resizeBox);},0);try{_19.some(_88._searchElements,function(_8a){if(!_8a.get("hidden")){_8a.focus();return true;}});}catch(e){}}});_6.hideOverflow(this.domNode);this._searchWipeIn.play();}},applyContext:function(_8b,_8c){if(this._metaEntity==null){if(_8c){_8c();}return;}if(!this._dataSource){_13.error(this.id+".applyContext: Applying context before rendered!!!");if(_8c){_8c();}return;}this.cloneContext(_8b);this.setUpdateInterval();_19.forEach(this._toolWidgets,function(_8d){_8d.applyContext(this.mxcontext);},this);this._gridState.xpathConstraint="";var _8e=this.mxcontext.getParam("xpathConstraint");if(_8e){this._gridState.xpathConstraint+=_8e;}this.removeSubscriptions();this.registerSubscriptions();if(!this._gridState.inDenial){var _8f=[];if(this.constraintsFilled()){var _90=[];var _91=function(_92){return function(_93){_92.reinit(_93);};};_19.forEach(this._searchElements,function(_94){_90.push(_91(_94));});_8f.push(function(_95){this.collect(_90,_95);});_8f.push(function(_96){if(this._dataSource.setConstraints){var _97=this._previousSearchConstraints?this._previousSearchConstraints:this._searchGetConstraints();this._previousSearchConstraints="";this._dataSource.setConstraints(_97);}this._dataSource.setOffset(this.getState("pageOffset",0));this._dataSource.reload(_96);});}else{_8f.push("actCleanDS");}this.sequence(_8f,function(){if(!this._preserveSelection){this.selection=this.getState("selectedGuids",[]);this.filterSelected();}this.refreshGrid();_8c();});}else{if(_8c){_8c();}}},filterSelected:function(){this.selection=_19.filter(this.selection,function(_98){return this._dataSource.getObject(_98)!=null;},this);},objectUpdateNotification:function(){var _99=this;if(!this._gridState.inDenial&&this.constraintsFilled()){this._dataSource.isValid(function(_9a){if(_9a){_99.sequence([_1a.hitch(_99._dataSource,"entityUpdate"),function(_9b){this.filterSelected();this.refreshGrid();if(_9b){_9b();}}]);}});}},refreshGrid:function(){if(this._dataSource.afterEnd()){this._dataSource.first(_1a.hitch(this,"refreshGrid"));return;}this.updatePagingStatus();this.fillGrid();this.resizeGrid();},actCleanDS:function(_9c){this.selection=[];this._dataSource.clean(_9c);},actionDeleteSelection:function(_9d){if(this._gridState.invertedSelection){}else{if(!this._hasSelection()){window.mx.ui.info(window.mx.ui.translate("mxui.widget.DataGrid","no_selection"));}else{var _9e=this;var _9f=function(){var _a0=_9e.selection;_9e.deselectAll();_9e._shareSelection(_9e._metaEntity.getEntity());window.mx.data.remove({guids:_a0,callback:function(){window.mx.data.sendClassUpdate(_9e.entity);},error:function(e){window.mx.onError(e);}});};if(_9d===true){_9f();}else{window.mx.ui.confirmation({content:window.mx.ui.translate("mxui.widget.DataGrid","confirm_delete",this.selection.length),handler:_9f});}}}},resize:function(box){var _a1=false;if(box){var _a2=_18.getMarginBox(this.domNode),_a3=_18.getMarginBox(this.contentNode),_a4=box.h-(_a2.h-_a3.h);if(_a4>_e.minContainerHeight){_17.set(this.contentNode,"height",_a4+"px");_a1=true;if(this.headTable){_17.set(this.headTable,"top","0px");}}}this.contentNode.style.overflow=_a1?"auto":"";if(!_a1){_17.set(this.contentNode,"height","auto");}this._resizeBox=box;},close:function(){this.disposeContent();},onHide:function(e){_19.forEach(this._searchElements,function(_a5){_a5.cleanup();});},storeState:function(_a6){_a6("searchBarVisible",this._gridState.searchBarVisible);_a6("searchConstraints",this._dataSource.getConstraints&&this._dataSource.getConstraints());_a6("pageOffset",this._dataSource.getOffset());if(this._gridState.selectable){_a6("selectedGuids",this.selection);}if(this._dataSource.getSortSettings){_a6("sortOptions",this._dataSource.getSortSettings());}var _a7={};_19.forEach(this._searchElements,function(_a8){_a7[_a8.path]=_a8.get("value");});_a6("searchInput",_a7);},uninitialize:function(){this.clearInterval();this.removeSubscriptions();this._clearSelectionStore();_d.destroyWidgetsIn(this.searchControlNode);_d.destroyWidgetsIn(this.toolBarNode);_d.destroyWidgetsIn(this.pagingBarNode);if(this.itemNode){_d.destroyWidgetsIn(this.itemNode);}if(this._dataSource){this._dataSource.destroy();}_19.forEach(this._searchElements,function(_a9){_a9.destroy();});}});return _1d;});