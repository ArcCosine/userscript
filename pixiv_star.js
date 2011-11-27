// ==UserScript==
// @name      pixiv star
// @namespace http://looxu.blogspot.com/
// @include   http://www.pixiv.net/member_illust*
// @author    Arc Cosine
// @version   2.5
// ==/UserScript==
// License    Public Domain
(function(){
  var PIXIV = {
    hover_size : 26,
    my_rate : 9,
    mode : false,
    handler : {
      'h' : function(){ PIXIV.rateChange(-1); },
      'l' : function(){ PIXIV.rateChange(1); },
      'Left' : function(){ PIXIV.rateChange(-1); },
      'Right' : function(){ PIXIV.rateChange(1); },
      'm' : function(){ PIXIV.rateSend(); },
      'n' : function(){ PIXIV.rateChange(1); PIXIV.rateSend(); },
      'b' : function(){ PIXIV.bookMark(); },
      'q' : function(){ PIXIV.moveLink(0); },
      'w' : function(){ PIXIV.moveLink(1); },
      'o' : function(){ PIXIV.addWatch(); },
    },
    specialKey : {
      '13' : 'Ent',
      '37' : 'Left',
      '38' : 'Up',
      '39' : 'Right',
      '40' : 'Down'
    },
    init : function(){
      if( window.top != window.self ){ return; }
      var handle = (window.opera) ? 'keypress' : 'keydown';
      window.addEventListener( handle, function(e){ PIXIV.addKeyBind(e) },false );

      var searchClass = document.querySelectorAll('.bookmark .ui-button');
      if( searchClass.length > 0 ){
        searchClass[0].style.cssFloat = 'left';
        var tarBtn = searchClass[0].parentNode;
        if( tarBtn ){
          var registLink = document.createElement('a');
          registLink.addEventListener('click', function(){ PIXIV.bookMark(); }, false );
          registLink.innerHTML = '一発ブクマ';
          registLink.className = 'ui-button';
		  registLink.style.cssText = 'float:right; margin-left: 10px;'
          tarBtn.appendChild(registLink);
        }
      }

      searchClass = document.querySelectorAll('.person_menu');
      if( searchClass.length > 0 ){
        var fav = document.getElementById('favorite-button');
        if( fav.title.indexOf('お気に入りです') != 0 ){
          var profRegistLi = document.createElement('li');
          var registLink = profRegistLi.appendChild(document.createElement('span'));
          registLink.addEventListener('click', function(){ PIXIV.addWatch(); }, false );
          registLink.innerHTML = 'お気に入りに一発追加';
		  registLink.style.cssText = 'padding: 6px 0px 0px 0px;\
		  						width: 190px;\
								height: 23px;\
								display: block;\
								cursor:pointer;\
								color:#007ff9;';
          searchClass[0].appendChild( profRegistLi );
        }

      }

    },
    addKeyBind : function( eve ){
      var t=eve.target;
      var n=t.tagName.toLowerCase();
      if( t.nodeType != 1 || n == 'input' || n == 'textarea' ){
        return;
      }
      var pressKey = (eve.which || eve.keyCode);
      var keyChar = (eve.ctrlKey?'C-':'') + (eve.altKey?'A-':'') + (eve.shiftKey?'S-':'') + ((typeof PIXIV.specialKey[pressKey] == 'undefined' )?String.fromCharCode(pressKey).toLowerCase():PIXIV.specialKey[pressKey]);
      if( typeof PIXIV.handler[keyChar] == 'function' ){
        if( /(Down|Up)/.test(keyChar) && !PIXIV.mode ) return;
        eve.preventDefault();    //Stop Default Event
        PIXIV.handler[keyChar].apply();
      }
    },
    rateChange : function(num){
      PIXIV['my_rate'] += num;
      if( PIXIV['my_rate'] < 0  ) { PIXIV['my_rate'] =  0 };
      if( PIXIV['my_rate'] > 10 ) { PIXIV['my_rate'] = 10 };
      var chk = document.getElementsByClassName('r1-unit')[0];
      if( chk.tagName.toLowerCase() == 'li' ){
        return;
      }
      for( var i=1; i<11; i++ ){  //It's bad roop code ...;-)
        var rate_star = document.getElementsByClassName('r'+i+'-unit')[0];
        if( i <= PIXIV['my_rate'] ){
		  rate_star.style.cssText = 'background:url(http://source.pixiv.net/source/images/rating.png) left center;z-index: 2; width:' +  (PIXIV['hover_size']) + 'px;';
        }else{
		  rate_star.style.cssText = 'background:url(http://source.pixiv.net/source/images/rating.png) left top; z-index: 1;';
        }
      }
    },
    rateSend : function(){
      var w = (typeof unsafeWindow != 'undefined' ) ? unsafeWindow : window;
      w.countup_rating(PIXIV['my_rate']);  //pixiv api
    },
    bookMark : function(){
      var illust_id= document.getElementById('rpc_i_id').textContent;
      var tt = document.getElementsByName('tt')[0].value;
      var url = 'bookmark_add.php';
      var params = 'mode=add&type=illust&id=' + illust_id + '&tt=' + tt;

      var req = 'http://www.pixiv.net/' + url;
      var xhr = new XMLHttpRequest();
      xhr.open('POST',req, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function(){
        if( xhr.readyState == 4 && xhr.status == 200 ){
          location.reload();
        }
      }

      var loadingDiv = document.createElement('div');
      loadingDiv.innerHTML ='ブックマークに追加中……';
	  loadingDiv.style.cssText = '\
		position: fixed;\
		width: 640px;\
	  	height: 480px;\
		margin: -320px 0px 0px -240px;\
		opacity: 0.5;\
		font-size: 48px;\
		text-align: center;\
		background: #000;\
		color:#fff;\
		border-radius: 1em;\
		moz-border-radius: 1em;\
		top: 50%;\
		left: 50%;\
		line-height: 480px;\
		z-index: 999;\
		';


      document.body.appendChild(loadingDiv);

      xhr.send(params);

    },
    addWatch : function(){
      var f = document.querySelectorAll('#favorite-preference form');
      if( f[0] ){
        var iframe = document.createElement('iframe');
        iframe.name = 'pixiv_star_work';
        document.body.appendChild(iframe);
        f[0].target = 'pixiv_star_work';
        f[0].submit();

        iframe.addEventListener('load',function(){
          location.reload();
        },false )
      }
    },
    moveLink : function(pos){
      var aLink= document.querySelectorAll('div.centeredNavi ul li.linkstyle a');
      var navLink = [];
      for( var i=0, l=aLink.length; i<l; i++ ){
        if( aLink[i].href.match(/member_illust.php\?mode=medium\&illust_id=[^#]*$/) ){
          navLink.push(aLink[i].href);
        }
      }
      if( navLink.length > 1 ){
        location.href = navLink[pos];
      }else{
        if( typeof navLink[0] != 'undefined' ){
          location.href = navLink[0];
        }
      }
    }
  };


  if( window.opera ){
    document.addEventListener('DOMContentLoaded',function(){ PIXIV.init(); },false );
  }else{
    PIXIV.init(); //for greasemonkey
  }

})();
