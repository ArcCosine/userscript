// ==UserScript==
// @name           ldc_and_ldr_regist_rate
// @namespace      http://looxu.blogspot.com/
// @include        http://reader.livedoor.com/subscribe/*
// @include        http://clip.livedoor.com/clip/add*
// @include        http://clip.livedoor.com/clip/edit*
// ==/UserScript==
(function(){

var rate_change = function(arg){
    var rate;
    if( location.href.match(/clip.livedoor.com/)){
        rate = rate_parse(document.getElementById('rate').value,arg);
        var el = document.getElementById('rate_img');
        if(!el.getAttribute('orig_src')){
            el.setAttribute('orig_src',el.src);
        }
        el.src = '/img/rate/pad/' + rate + '.gif';
        document.getElementById('rate').value = rate;
    }else if( location.href.match(/reader.livedoor.com/) ){
        var tar = document.getElementsByName('rate');
        rate = rate_parse(tar[0].value,arg);
        var el = document.getElementsByTagName('img');
        for( var i=0; i<el.length; i++ ){
            if( el[i].src.match(/img\/rate\/pad/) ){
                el[i].src = '/img/rate/pad/' + rate + '.gif'
                break;
            }
        }
        tar[0].value = rate;
    }
};

var rate_parse = function(rate, diff){
    var ret = parseInt(rate) + parseInt(diff);
    if( ret < 0 ) ret = 0;
    if( ret > 5 ) ret = 5;
    return ret;
}

var addKeyBind = function( keyChar, func, eve ){
    var t=eve.target;
    var n=t.tagName.toLowerCase();
    if( t.nodeType != 1 || n == 'input' || n == 'textarea' ){
        return;
    }
    var pressKey = eve.which;
    keyChar = keyChar.charCodeAt(keyChar);
    if( pressKey == keyChar ){
        eve.preventDefault();    //Stop Default Event 
        func.apply();
    }
}

window.addEventListener( 'keypress', function(e){
    addKeyBind( 'q', function(){ rate_change(-1); }, e);
    addKeyBind( 'w', function(){ rate_change(1);}, e);
},false );

})();
