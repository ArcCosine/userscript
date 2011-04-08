// ==UserScript==
// @name      nico ldrize
// @namespace http://looxu.blogspot.com/
// @include   http://www.nicovideo.jp/mylist/*
// @include   http://www.nicovideo.jp/ranking*
// @author    Arc Cosine
// @version   1.0
// ==/UserScript==
(function(_doc,_win){
  var NicoLDRize = {};
  NicoLDRize.keyDivs = {};
  NicoLDRize.init = function(){
    var specialkey = {'13' : 'ENT'};
    var keyHandler = {
      'J' : function(){ NicoLDRize.scroll(1); },
      'K' : function(){ NicoLDRize.scroll(-1); },
      'ENT' : function(){ NicoLDRize.openTab(); }
    };
    NicoLDRize.pos = 0;
    NicoLDRize['keyDivs'] = _doc.querySelectorAll('div.content_672 > div');
    NicoLDRize['aTags'] = _doc.querySelectorAll('div.content_672 a.watch');
    var allow = _doc.createElement('div');
    allow.id = 'nicoldrize';
    allow.style.width = '1em';
    allow.style.height= '1em';
    allow.style.position = 'absolute';
    allow.style.top = NicoLDRize['keyDivs'][0].offsetTop + 40 + 'px';
    allow.style.left = NicoLDRize['keyDivs'][0].offsetLeft - 40 + 'px';
    allow.innerHTML = "→";
    _doc.body.appendChild(allow);

    _win.addEventListener('keypress',function(e){
      if( e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' ) return;
      var keyCode = e.which;
      var pressKey=  (typeof specialkey[keyCode] == 'undefined') ? String.fromCharCode(keyCode).toUpperCase() : specialkey[keyCode];
      if( typeof keyHandler[pressKey] != "function" ) return;
      e.preventDefault();
      keyHandler[pressKey].apply();
    },false );

  }
  NicoLDRize.scroll = function(num){
    NicoLDRize.pos += num;
    if (NicoLDRize.pos < 0) { NicoLDRize.pos = 100 };
    if (NicoLDRize.pos > 100) { NicoLDRize.pos = 0 };
    var pos = NicoLDRize.keyDivs[NicoLDRize.pos].offsetTop - 25;
    _win.scrollTo(0,pos);
    _doc.getElementById('nicoldrize').style.top = pos + 60 + 'px';
  }
  NicoLDRize.openTab = function(){
    _win.open(NicoLDRize.aTags[NicoLDRize.pos-1].href);
  }
  _doc.addEventListener('DOMContentLoaded',function(){
      _win.setTimeout( function(){
      var images = _doc.querySelectorAll("img");
      for( var i=0,l=images.length; i<l; i++ ){
        if( images[i].title ){
          images[i].src = images[i].title;
          images[i].title = '';
        }
      }}, 1000 );
    if(location.href.match(/nicovideo.jp\/ranking/)){
      NicoLDRize.init();
    }
  },false );
})(document,window);
