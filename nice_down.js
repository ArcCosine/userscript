// ==UserScript==
// @name           nice down
// @namespace      http://looxu.blogspot.com/
// @include        http://book.akahoshitakuya.com/bl/*
// ==/UserScript==
(function(_doc, _win){
	var _lists = [], _iz = 0, _izlast = 0;

	function changeAndScroll( node ){

		var ot = node.offsetTop;

		node.className += " keySelect";
		node.style.backgroundColor = '#f8ffec';

		_win.scrollTo( 0, ot );
	}

	function addKeyBind( keyChar, func, eve ){
		var t=eve.target, n=t.tagName.toLowerCase();

		if( t.nodeType != 1 || n == 'input' || n == 'textarea' ){
			return;
		}

		var pressKey = eve.which;

		keyChar = (keyChar=='Enter') ? 13 : keyChar.charCodeAt(keyChar);
		if( pressKey == keyChar ){
			eve.preventDefault();    //Stop Default Event
			func.apply();
		}
	}

	function downlist(){
		for( var i=0;i<_iz;i++){
			if( update( _lists[i], _lists[i+1], _lists[0] ) ){
				break;
			}
		}
	}

	function uplist(){
		for( var i=0;i<_iz;i++){
			if( update( _lists[i], _lists[i-1], _lists[_izlast] ) ){
				break;
			}
		}
	}

	function update( targetNode, destNode, otherNode ){
		var cn = targetNode.className;

		if( /keySelect/.test(cn) ){
			targetNode.className = cn.replace(/ keySelect/,'');
			targetNode.style.backgroundColor = '';

			var move = (destNode) ? destNode : otherNode;

			changeAndScroll( move );

			return true;
		}
		return false;
	}


	function nicedown(){
		var nodes = _doc.querySelectorAll('.keySelect .log_list_info span a'),
			i=0, iz = nodes.length;

		for(;i<iz;i++){
			if( /nice/.test(nodes[i].href) ){
				var text = nodes[i].href.replace(/javascript:/,'');

				eval( text );
				break;
			}
		}
		downlist();

	}

	function next(){
		var now = _doc.querySelector('.page_navis span.now_page'),
			next = now.nextSibling.firstChild.href;

		location.href = next;
	}


	function init(){
		_lists = _doc.querySelectorAll('.log_list_box');
		_iz = _lists.length;
		_izlast = _iz-1;

		if( _lists[0] ){
			changeAndScroll( _lists[0] );
		}

		_win.addEventListener('keypress', function(eve){
			addKeyBind( 'j', downlist, eve);
			addKeyBind( 'k', uplist, eve );
			addKeyBind( 'l', nicedown,eve );
			addKeyBind( 'n', next,eve );
		}, false );
	}
	_doc.addEventListener('DOMContentLoaded', init, false );
})(document, window);
