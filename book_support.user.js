// ==UserScript==
// @name    book support
// @namespace http://looxu.blogspot.com/
// @include http://www.amazon.co.jp/*
// @author  Arc Cosine
// @version 1.4
// @LICENSE Public Domain
// ==/UserScript==
(function(){

  var bookLogList = {
    "Bookmater" : {
      "url" : "http://book.akahoshitakuya.com/b/{ASIN}/",
      "favicon" : "http://book.akahoshitakuya.com/favicon.ico"
    },
    "booklog" : {
      "url" : "http://booklog.jp/item/1/{ASIN}/",
      "favicon" : "http://booklog.jp/favicon.ico"
    },
    "bukkupe" : {
      "url" : "http://bukupe.com/book/{ASIN}/",
      "favicon" : "http://bukupe.com/favicon.ico"
    },
    "TwitterSearch" : {
      "url" : "https://twitter.com/search?q={ASIN}",
      "favicon" : "https://twitter.com/favicon.ico" 
    },
    // Move kinokuniya
    "Kinoppy" : {
      "url" : "http://www.kinokuniya.co.jp/disp/CSfDispListPage_001.jsp?qs=true&ptk=03&q={ASIN}",
      "favicon" : "http://www.kinokuniya.co.jp/favicon.ico",
      "option" : function(_self,node){
        var ee = document.getElementsByTagName("B"),
            i = 0, iz = ee.length,
            one = null, asin = "";

        for(;i<iz;i++){
          one = ee[i];
          if( one.innerHTML === "ISBN-13:" ){
            asin = one.nextSibling.nodeValue.replace(/[^\d]*(\d+)-(\d+).*/, "$1$2");
            break;
          }
        }
        if( asin !== "" ){
          node.href = _self.url.replace(/{ASIN}/,asin);
        }
      }
    }
  };

  function init(){

    var target = document.getElementById("btAsinTitle");
    
    if( target ){
    
      var asin = document.getElementById("ASIN").value,
          div = document.createElement("div"),
          key = "", one = null, img = null, link = null;
      
      for( key in bookLogList ){
        one = bookLogList[key];
      
        link = div.appendChild(document.createElement("a"));
        link.href = one.url.replace(/{ASIN}/,asin);
        link.style.margin = "0px 16px 0px 0px";
        link.alt = "Go to page";
      
        img = link.appendChild(document.createElement("img"));
        img.src = one.favicon;
        img.style.width = "16px";
        img.style.height= "16px";
      
        // option code.
        if( typeof one.option !== "undefined" && typeof one.option === "function" ){
          one.option(one,link);
        }
      
      }
      target.parentNode.insertBefore(div, target);
    }
  }
 
  init(); 
})();
