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
    showTasksCount();

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

        if (window.format){
            tasksCount = window.format.getListStatistics(window.listTabs.data[i][1])[5];
            listItems[i].firstChild.style.color = "black";
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
    var keyList = "12qweJK";

    var tabs = window.view.getViewTabs();
    
    var pressKey = ev.which;
    pressKey = String.fromCharCode(pressKey);


    if( keyList.indexOf(pressKey,0) > -1 ){
        
        addKeyBind( "1", function(){  }, ev );
        addKeyBind( "2", function(){  }, ev );
        addKeyBind( "q", function(){ window.utility.stopEvent(ev); rateChage(1); }, ev );
        addKeyBind( "w", function(){ window.utility.stopEvent(ev); rateChage(2); }, ev );
        addKeyBind( "e", function(){ window.utility.stopEvent(ev); rateChage(3); }, ev );
        addKeyBind( "J", function(){ window.utility.stopEvent(ev); tabs.selectRight(); }, ev );
        addKeyBind( "K", function(){ window.utility.stopEvent(ev); tabs.selectLeft(); }, ev );

        return false;
    }
    return true;
}

//Ç¢Ç¬Ç‡ÇÃ
var addKeyBind = function( keyChar, func, eve ){
    var t=eve.target;
    var n=t.tagName.toLowerCase();
    if( t.nodeType != 1 || n == "input" || n == "textarea"  ){
        return;
    }
    var pressKey = eve.which;
    keyChar = keyChar.charCodeAt(keyChar);
    if( pressKey == keyChar ){
        func.apply();//preventDefaultÇÕécÇµÇƒÇ®Ç¢ÇΩÅB1/2Ç≈êÿÇËë÷Ç¶ÇΩÇ¢Ç©ÇÁ
    }
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

window.addEventListener('load', moveTabsToTheLeft, false);
window.addEventListener('load', overrideBodyKeyPressHandler, false);
