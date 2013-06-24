// ==UserScript==
// @name      nico description
// @namespace http://looxu.blogspot.com/
// @include   http://www.nicovideo.jp/watch/*
// @author    Arc Cosine
// @version   5.0
// ==/UserScript==
(function(_doc){

	var NDesc = {
		init : function(){

			if( window.parent != window ){ 
				return;
			}
			//set global
			NDesc.flvplayer = _doc.getElementById('external_nicoplayer');

			//add Input Box
			NDesc.createInput();

			//add focus key event
			_doc.addEventListener( 'keydown', NDesc.bindHotkey, false );

		},
		bindHotkey: function(eve){
			if( eve.target.tagName !==    'INPUT' && eve.keyCode === 32 ){
				NDesc.use_hotkey();
				eve.preventDefault();
			}
		},
		createInput : function(){

			var iw = _doc.createElement('input'),
				vt = _doc.querySelector('#videoHeaderDetail h2 span.arrow'),
				is = iw.style;

			iw.readOnly = true;
			iw.autocomplete = 'off';
			is.width = '20px';
			is.margin = '0px';
			is.fontSize = '10px';
			iw.addEventListener('focus', NDesc.available ,false );
			iw.addEventListener('blur', NDesc.unavailable, false );
			iw.addEventListener('keypress', NDesc.key_event, false );

			vt.parentNode.insertBefore( iw, vt.nextSibling );
			NDesc.input = iw;
		},
		available: function(){
			NDesc.input.style.backgroundColor = '#fcc';
			NDesc.input.value  = '有効';
		},
		unavailable: function(){
			NDesc.input.style.backgroundColor = '#9d9';
			NDesc.input.value  = '無効';
		},
		use_hotkey : function(){
			NDesc.input.focus();
		},
		play_pause : function(){
			if( !NDesc.flvplayer ) return;
			if( NDesc.flvplayer.ext_getStatus() == 'playing' ){
				NDesc.flvplayer.ext_play(0);
			}else{
				NDesc.flvplayer.ext_play(1);
			}
		},

		volumeup : function(){
			NDesc.volume(5);
		},
		volumedown : function(){
			NDesc.volume(-5);
		},
		seekleft : function(){
			NDesc.seek(-10);
		},
		seekright : function(){
			NDesc.seek(10);
		},
		seek2top : function(){
			NDesc.seek(Number.NEGATIVE_INFINITY);
		},
		volume : function(vol){
			if (!NDesc.flvplayer) return;
			var cur = Number(NDesc.flvplayer.ext_getVolume());
			var to = cur + Number(vol);
			if (to > 100) to = 100;
			if (to < 0  ) to = 0;
			NDesc.flvplayer.ext_setVolume(to);
		},
		seek : function(time) {
			if (!NDesc.flvplayer) return;
			var len = Number(NDesc.flvplayer.ext_getTotalTime()),
				cur = Number(NDesc.flvplayer.ext_getPlayheadTime());
			var to = cur + Number(time);
			if (to > len) to = len;
			if (to < 0  ) to = 0;
			NDesc.flvplayer.ext_setPlayheadTime(to);
			// for shotage of backward seek.
			cur = Number(NDesc.flvplayer.ext_getPlayheadTime());
			if (time < 0 && cur - to > 5 && to > 10) {
				NDesc.flvplayer.ext_setPlayheadTime(to - 10);
			}
		},
		key_event : function(eve) {
			var handler = {
					' ' : function(){ NDesc.play_pause();  },
					'k' : function(){ NDesc.volumeup(); },
					'j' : function(){ NDesc.volumedown(); },
					'h' : function(){ NDesc.seekleft(); },
					'l' : function(){ NDesc.seekright(); },
					'H' : function(){ NDesc.seek2top(); }   //Shift+H
				},
				t = eve.target,
				pressKey = String.fromCharCode(eve.which);

			if( t.nodeType === 1 && typeof handler[pressKey] === "function" ){
				eve.preventDefault();
				handler[pressKey].apply();
			}
		}
	};

	_doc.addEventListener('DOMContentLoaded', function(){ NDesc.init(); },false );

})(document);
