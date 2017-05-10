/*
    Copyright (c) 2005-2015, Mendix bv. All rights reserved.
    See licenses.txt for third party licenses that apply.
*/

//>>built
define("reporting/lib/ChartBuilder",["reporting/lib/MetaResult","dojo/i18n","dojo/_base/array"],function(_1,_2,_3){return function(_4){var _5=_4.oqlsource.getSeriesData();var _6=_4.oqlsource.getSeriesDescriptives();var _7=_4.oqlsource.getIntervalDescriptives();var _8=_4.oqlsource.getInformation();var _9=null;var _a=null;var _b=0;var _c=new _1([_4.oqlsource.getIntervalType()]);if(typeof _4.ymin=="number"){_9=_4.ymin;}if(typeof _4.ymax=="number"){_a=_4.ymax;}if(typeof _4.precision=="number"){_b=_4.precision;}var _d={};_d.multi=["38BDFF","387EFF","5638FF","B938FF","FF38A6","FF4538","FF8938","FFB538","FFDD38","F9FF38","C7F627","21F228"];_d.single=["0099FF","0037FF","4800FF","C800FF","FF006A","FF3300","FF7900","FFAE00","FFE100","EAFF00","97CE0C","0CCE86"];var _e=0;function _f(_10){_e=(_e==_d[_10].length)?0:_e+1;return _d[_10][_e];};function _11(){return _2.getLocalization("dojo.cldr","number");};function _12(str){return str.replace(/['"<>&]/g," ");};function _13(str){return str.replace(/"/g,"%26quot;").replace(/'/g,"%26apos;");};_8.title="";_8.xaxis=_12(_4.xcaption);_8.yaxis=_12(_4.ycaption);var _14="<graph caption='"+_8.title+"' xAxisName='"+_8.xaxis+"' yAxisName='"+_8.yaxis+"' showValues='0' rotateNames='0' slantLabels='0' showShadow='1' showToolTip='1' formatNumberScale='0'";var _15=isNaN(_9)?0:parseInt(_9);var _16=isNaN(_a)?1:(_a>_15?parseInt(_a):(_15+1));_14+=" yAxisMinValue='"+parseInt(_15)+"'";_14+=" yAxisMaxValue='"+parseInt(_16)+"'";if(_16==1&&_15===0&&_b===0){_b=2;}if(_b!=null){_14+=" decimalPrecision='"+_b+"'";}var _17=_11();_14+=" thousandSeparator='"+_17.group+"'";_14+=" decimalSeparator='"+_17.decimal+"'";_14+=">";_14+="<categories>";_3.forEach(_7,function(_18){_14+="<category name='"+_13(_c.getRenderValue(0,_18))+"' />";});_14+="</categories>";for(var i=0;i<_6.length;i++){_14+="<dataset seriesName='"+_13(_6[i])+"' color='"+_f("multi")+"'>";for(var j=0;j<_5[i].length;j++){_14+="<set value='"+_5[i][j]+"' />";}_14+="</dataset>";}_14+="</graph>";return _14;};});