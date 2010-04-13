// ==UserScript==
// @name            A Bit Bad RTM
// @namespace       http://www.rememberthemilk.com
// @include         http://www.rememberthemilk.com/*
// @include         https://www.rememberthemilk.com/*
// ==/UserScript==

/** simple version of $X
 * $X(exp);
 * $X(exp, context);
 * @source http://gist.github.com/3242.txt
 */
var $X = function (exp, context) {
  context || (context = document);
  var expr = (context.ownerDocument || context).createExpression(exp, function (prefix) {
    return document.createNSResolver(context.documentElement || context).lookupNamespaceURI(prefix) ||
      context.namespaceURI || document.documentElement.namespaceURI || "";
  });
 
  var result = expr.evaluate(context, XPathResult.ANY_TYPE, null);
    switch (result.resultType) {
      case XPathResult.STRING_TYPE : return result.stringValue;
      case XPathResult.NUMBER_TYPE : return result.numberValue;
      case XPathResult.BOOLEAN_TYPE: return result.booleanValue;
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        // not ensure the order.
        var ret = [], i = null;
        while (i = result.iterateNext()) ret.push(i);
        return ret;
    }
  return null;
}

//refresh 対策
var overrideListTabsBlitDiv = function()
{
    if (window.listTabs)
    {
        var oldBlitDiv = window.listTabs.blitDiv;

        window.listTabs.blitDiv = function()
        {
            oldBlitDiv.call(window.listTabs);
            refreshListTabsStyles();
            showTasksCount();
            hideLists();
        }    

        window.listTabs.blitDiv();
    }
}

var refreshListTabsStyles = function()
{
    var divListTabs = document.getElementById("listtabs");

    divListTabs.firstChild.style.listStyle = "none";
    divListTabs.firstChild.style.padding = "0px 5px 0px 5px";
    divListTabs.firstChild.style.whiteSpace = "nowrap";
}

var hideLists = function()
{
    if (window.listTabs)
    {
        var listItems = window.listTabs.div.getElementsByTagName("li");
        
        for (var i = 0; i < window.listTabs.data.length; ++i)
        {
            if (window.listTabs.data[i] && isListHidden(window.listTabs.data[i][1]))
                listItems[i].style.display = "none";
        }

    }
}


var overrideTaskCloudUpdate = function()
{
    var oldTaskCloudUpdate = window.taskCloud.update;

    window.taskCloud.update = function()
    {
        oldTaskCloudUpdate.call(window.taskCloud);
        window.listTabs.blitDiv();
    }    
}


//Column
var createLeftColumn = function()
{
    var leftColumn = document.createElement('div');
    var appView = document.getElementById("appview");
    var listBox = document.getElementById("listbox");

    leftColumn.setAttribute('id','leftColumn');
    leftColumn.style.cssFloat = "left";
    leftColumn.style.paddingLeft = "5px";
    leftColumn.style.paddingRight = "8px";
    leftColumn.style.display = "none";

    if (appView && listBox){
        appView.insertBefore(leftColumn, listBox);
    }
}

var createListTabsContainer = function()
{
    var listTabsBox = document.createElement('div');
    var leftColumn = document.getElementById("leftColumn");

   listTabsBox.innerHTML = '<div class="white_rbroundbox"> <div class="white_rbtop"> <div> <div></div> </div> </div> <div class="white_rbcontentwrap"> <div class="white_rbcontent"> <table><tr><td><div class="taskcloudcontent" style="padding: 0px 5px 0px 5px;" id="listtabscontainer"> </div></td></tr></table> </div> </div> <div class="white_rbbot"> <div><div></div> </div> </div> </div> ';

    leftColumn.appendChild(listTabsBox);
}

var moveListTabs = function()
{
    var listTabs = document.getElementById("listtabs");

    listTabs.className = "";
    listTabs.style.width = "100%";
    listTabs.firstChild.style.listStyle = "none";
    listTabs.firstChild.style.padding = "0px 5px 0px 5px";
    listTabs.firstChild.style.whiteSpace = "nowrap";

    var listTabsContainer = document.getElementById("listtabscontainer");

    if (listTabsContainer){
        listTabsContainer.appendChild(listTabs);
    }
}

var showTasksCount = function()
{
    var listItems = $X("//*[@id=\"listtabs\"]/ul/li");

    for (var i = 0; window.listTabs.data && window.listTabs.data[i]; ++i)
    {
        var tasksCount = 0;

        if (window.listTabs.data[i][2])
        {
            var filter = window.listTabs.data[i][2];

            if (filter && filter.indexOf("status:") < 0){
                filter = "(" + filter + ") and (status:incomplete)";
            }

            if (window.overviewList && filter){
                tasksCount = window.overviewList.getFilteredList(filter).length
            }
        }
        else
        {
            if (window.format){
                tasksCount = window.format.getListStatistics(window.listTabs.data[i][1])[5];
                listItems[i].firstChild.style.color = "black";
            }

        }
        if (tasksCount > 0){
            listItems[i].firstChild.innerHTML += " (" + tasksCount + ")";
        }
    }
}

var moveTabsToTheLeft = function()
{

    createLeftColumn();
    createListTabsContainer();
    moveListTabs();

    var tools_spacer = document.getElementById("tools_spacer");
    tools_spacer.style.paddingTop = "1px";
    tools_spacer.style.borderTop = "1px solid #CACACA";
 
    document.getElementById("sorting").style.marginTop = "0px";
    document.getElementById("tools").style.paddingTop = "5px";

    var content = document.getElementById("content");
    var leftColumn = document.getElementById("leftColumn");
    var listTabsContainer = document.getElementById("listtabscontainer");

    leftColumn.style.display = "block";
    leftColumn.style.width = Math.round(listTabsContainer.clientWidth * 1.14) + "px";
    content.style.width = (973 + leftColumn.clientWidth) + "px";
}


//Keyboard
var handleKeyPressEvent = function(ev)
{
    
    var tabs = window.view.getViewTabs();

    var handler = {
        "1"  : function(){},
        "2"  : function(){},
        "q"  : function(){ window.utility.stopEvent(ev); rateChage(1); },
        "w"  : function(){ window.utility.stopEvent(ev); rateChage(2); },
        "e"  : function(){ window.utility.stopEvent(ev); rateChage(3); },
        "J"  : function(){ window.utility.stopEvent(ev); tabs.selectRight(); },
        "K"  : function(){ window.utility.stopEvent(ev); tabs.selectLeft(); }
    };

    var t=ev.target;
    var n=t.tagName.toLowerCase();
    if( t.nodeType != 1 || n == "input" || n == "textarea" ){
        return true;
    }

    var pressKey = String.fromCharCode(ev.which);
    if( typeof handler[pressKey] != "function" ){
        return true;
    }

    handler[pressKey].apply();
    return false;
}

var rateChage = function(v){
    eval("window.taskList.tasksSetPriority"+ v +"();");
}

var overrideBodyKeyPressHandler = function()
{
    var oldBodyKeyPressHandler = window.eventMgr.bodyKeyPressHandler;
    window.eventMgr.bodyKeyPressHandler = function(ev, ignoreCombo)
    {
        if (handleKeyPressEvent(ev)){
            return oldBodyKeyPressHandler.call(window.eventMgr, ev, ignoreCombo);
        }

        return true;
    }
}

window.addEventListener('load', overrideListTabsBlitDiv, false);
window.addEventListener('load', moveTabsToTheLeft, false);
window.addEventListener('load', overrideBodyKeyPressHandler, false);
window.addEventListener('load', overrideTaskCloudUpdate, false);
