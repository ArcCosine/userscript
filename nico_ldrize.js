// ==UserScript==
// @name      nico ldrize
// @namespace http://looxu.blogspot.com/
// @include   http://www.nicovideo.jp/mylist/*
// @include   http://www.nicovideo.jp/ranking*
// @include   http://www.nicovideo.jp/search/*
// @author    Arc Cosine
// @version   1.2
// ==/UserScript==
(function(_doc,_win){
	// ランキングや検索結果ページをLDRizeする
	// 1col 表示のみ対応。超オレオレ仕様
	// mylistページは、イメージを全部先に読み込む動きをする
	// scroll事に読み込むのはイライラするので
	var NicoLDRize = {};
	NicoLDRize.keyDivs = {};
	NicoLDRize.init = function(){
		var specialkey = {'13' : 'ENT'};
		var keyHandler = {
			'J' : function(){ NicoLDRize.scroll(1); },
			'K' : function(){ NicoLDRize.scroll(-1); },
			'ENT' : function(){ NicoLDRize.openTab(); }
		};
		var selector = {
			'ranking' : { 'keyDivs' : 'div.content_672 > div', 'aTags': 'div.content_672 a.watch' },
			'search' : { 'keyDivs' : '.thumb_col_1', 'aTags': '.thumb_col_1 a.watch' }
		};

		var s = selector['ranking'];
		var max = 100;
		if(location.href.match(/nicovideo.jp\/search/) ){
			s = selector['search'];
			max  = 31;
		}

		NicoLDRize['keyDivs'] = _doc.querySelectorAll(s['keyDivs']);
		NicoLDRize['aTags'] = _doc.querySelectorAll(s['aTags']);

		NicoLDRize.pos = 0;
		NicoLDRize.max = max;
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
		NicoLDRize.pos = (NicoLDRize.pos<0) ? NicoLDRize.max : (NicoLDRize.pos > NicoLDRize.max) ? 0 : NicoLDRize.pos;
		var pos = NicoLDRize.keyDivs[NicoLDRize.pos].offsetTop - 25;
		_win.scrollTo(0,pos);
		_doc.getElementById('nicoldrize').style.top = pos + 60 + 'px';
	}
	NicoLDRize.openTab = function(){
		var pos = ( NicoLDRize.max == 100 ) ?  NicoLDRize.pos-1 : NicoLDRize.pos;
		_win.open(NicoLDRize.aTags[pos].href);
	}

	NicoLDRize.resize = function(){
		var s = 'div.content_672 > div';
		if( NicoLDRize.max == 100 ){ s = '.thumb_col_1' }
		_doc.getElementById('nicoldrize').style.left = _doc.querySelectorAll(s)[0].offsetLeft - 40 + 'px';
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
		if(location.href.match(/nicovideo.jp\/ranking/) || location.href.match(/nicovideo.jp\/search/)){
			NicoLDRize.init();
			_win.addEventListener('resize',function(){ NicoLDRize.resize(); }, false );
		}
	},false );
})(document,window);
