// ==UserScript==
// @name        toggleAutoPatchWork
// @namespace   http://looxu.blogspot.com
// @description toggle switch AutoPatchWork
// @include     http://*
// @exclude     http://jsdo.it/*
// @exclude     http://livedoor.blogcms.jp/*
// ==/UserScript==
(function(){
  if(window.AutoPatchWork){
    var Toggle = {
      keyHandler : { 'I' : function(){ Toggle.fire(); } },
      specialKey : {},
      init : function(e){
        if( /INPUT|TEXTAREA/.test(e.target.tagName) ) return;
        var kcode = e.which || e.keyCode;
        var pressKey = (Toggle.specialKey[kcode]) ? Toggle.specialKey[kcode] : String.fromCharCode(kcode).toUpperCase();
        if( typeof Toggle.keyHandler[pressKey] == 'function' ){
          e.preventDefault();
          Toggle.keyHandler[pressKey].apply();
        }
      },
      fire : function(){
        var ev = document.createEvent('Event');
        ev.initEvent('AutoPatchWork.toggle',true,false);
        document.dispatchEvent(ev);
      }
    };
    window.addEventListener( (window.opera)?'keypress':'keydown',function(e){ Toggle.init(e); },false);
  }
})();
