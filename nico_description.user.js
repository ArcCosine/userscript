// ==UserScript==
// @name      nico description
// @namespace http://looxu.blogspot.com/
// @include   http://www.nicovideo.jp/watch/*
// @author    Arc Cosine
// @version   2.0
// ==/UserScript==
(function(){
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

    //無駄なオブジェクト指向www
    var NDesc = function(){

        this.com_style = {
            'color' : '#1259C7',
            'text-decoration' : 'underline',
            'margin-right' : '5px'
        };

        this.options = [
            { 'text' : 'Video詳細', 'func' : function(){ NDesc.prototype.description_toggle(); } },
            { 'text' : 'mitter',    'func' : function(){ NDesc.prototype.popup(); } },
            { 'text' : '広告表示',  'func' : function(){ NDesc.prototype.advert_toggle(); } }
        ];

        this.mitter = false;

        //fire!
        this.init();
    }

    NDesc.prototype.init= function(){
        //add input box
        this.createInput();

        //hide parts
        this.description_toggle();
        this.advert_toggle();

        //add focus key event
        document.addEventListener( 'keypress', function(e){
            if (e.target.tagName == 'INPUT') return;
            if (e.keyCode == 32) {
                NDesc.prototype.use_hotkey();
                e.preventDefault();
            }
        }, false );

        //create parts
        this.pos = $X('//div[@id="des_2"]/p[@class="TXT12"]/a')[0];
        if( typeof this.pos == "undefined" ){
          //this.pos = $X('//div[@id="des_2"]/p[@class="TXT12"]/nobr/a[last()]')[0];
          this.pos = $X('//div[@id="des_2"]/table/tbody/tr/td/p[@class="TXT12"]')[0];
        }
        for( var i=0; i<this.options.length; i++ ){
            this.createParts( this.options[i] );
        }
    }

    NDesc.prototype.createParts = function( data ){
        var node = document.createElement('span');
        node.appendChild(document.createTextNode(data['text']));
        this.setCSS(node,this.com_style);
        this.pos.parentNode.insertBefore( node, this.pos );
        node.addEventListener( 'click', function(){ data['func'].apply(); }, false );
    }

    NDesc.prototype.setCSS =function( node, options ){
        for( var option in options ){
            //It's cooooool css setting code! I think so... :)
            var st_op = option.replace( /-([a-zA-Z])/, function(m){ return m[1].toUpperCase(); }); 
            node.style[st_op] = options[option];
        }
    }

    NDesc.prototype.toggleObject = function(xpath){
        var t= $X(xpath)[0];
        t.style.display = ( t.style.display == 'none' ) ? 'block' : 'none';
    }

    NDesc.prototype.description_toggle = function(){
        this.toggleObject('//div[@id="des_2"]/div');
        this.toggleObject('//div[@id="des_2"]/div[last()]');
    }

    NDesc.prototype.advert_toggle = function(){
        this.toggleObject('//div[@id="WATCHFOOTER"]');
        this.toggleObject('//div[@id="PAGEFOOTER"]');
    }


    NDesc.prototype.popup = function() {
        var autoclose = (!this.isMitter)? '&autoclose=true' : '';
        this.isMitter = true;
        // For eyevio
        var normalized_url = location.href;
        var url = "http://mitter.jp/bookmarklet/popup", v = "0";
        url += '?v=' + v + '&url=' + encodeURIComponent(normalized_url) + '&title=' + encodeURIComponent(document.title)+ autoclose;
        var options = 'toolbar=0,resizable=1,scrollbars=1,status=1,' + ((autoclose.length!=0)? 'width=1,height=1' : 'width=450,height=230');
        var open_func = function() {
            var w = window.open(url, 'mitter', options);
            if (!w) {
                alert('Popup window from Mitter seems to be blocked. Please allow popup window to post on Mitter.');
            } else {
                w.focus();
            }
        };
        open_func();
    }

    NDesc.prototype.createInput = function(){
        if (window.parent != window) return;
        NDesc.prototype.input = document.createElement('input');
        NDesc.prototype.input.readOnly = true;
        NDesc.prototype.input.autocomplete = 'off';
        NDesc.prototype.input.addEventListener('focus', function() {
            NDesc.prototype.input.style.backgroundColor = '#fcc';
            NDesc.prototype.input.value = 'Hotkey available.'
        }, false);
        NDesc.prototype.input.addEventListener('blur', function() {
            NDesc.prototype.input.style.backgroundColor = '#9D9';
            NDesc.prototype.input.value = 'Hotkey unavailable.'
        }, false);
        NDesc.prototype.input.addEventListener('keypress', NDesc.prototype.key_event, false);
        NDesc.prototype.input.style.margin = '0px 0px 5px 10px';
        var head = document.getElementsByTagName('h1')[0]
        head.appendChild(NDesc.prototype.input);

    }

    NDesc.prototype.use_hotkey = function(){
        NDesc.prototype.input.focus();
    }

    NDesc.prototype.play_pause = function(){
        var flvplayer = document.getElementById('flvplayer');
        if (!flvplayer) return;
        if (flvplayer.ext_getStatus() == 'playing') {
            flvplayer.ext_play(0);
        } else {
            flvplayer.ext_play(1);
        }
    }

    NDesc.prototype.volumeup = function(){
        this.volume(5);
    }

    NDesc.prototype.volumedown = function(){
        this.volume(-5);
    }

    NDesc.prototype.seekleft = function(){
        this.seek(-10);
    }

    NDesc.prototype.seekright = function(){
        this.seek(10);
    }

    NDesc.prototype.seek2top = function(){
        this.seek(Number.NEGATIVE_INFINITY);
    }

    NDesc.prototype.volume = function(vol){
        var flvplayer = document.getElementById('flvplayer');
        if (!flvplayer) return;
        var cur = Number(flvplayer.ext_getVolume());
        var to = cur + Number(vol);
        if (to > 100) to = 100;
        if (to < 0  ) to = 0;
        flvplayer.ext_setVolume(to);
    }

    NDesc.prototype.seek = function(time) {
        var flvplayer = document.getElementById('flvplayer');
        if (!flvplayer) return;
        var len = Number(flvplayer.ext_getTotalTime());
        var cur = Number(flvplayer.ext_getPlayheadTime());
        var to = cur + Number(time);
        if (to > len) to = len;
        if (to < 0  ) to = 0;
        flvplayer.ext_setPlayheadTime(to);
        // for shotage of backward seek.
        var cur = Number(flvplayer.ext_getPlayheadTime());
        if (time < 0 && cur - to > 5 && to > 10) {
            flvplayer.ext_setPlayheadTime(to - 10);
        }
    }


    NDesc.prototype.key_event = function(e){
        var handler = {
            'o' : function(){ NDesc.prototype.description_toggle(); },
            'm' : function(){ NDesc.prototype.popup(); },
            'a' : function(){ NDesc.prototype.advert_toggle(); },
            ' ' : function(){ NDesc.prototype.play_pause(); if( !NDesc.prototype.isMitter ){ NDesc.prototype.play_pause(); NDesc.prototype.popup();  } },
            'k' : function(){ NDesc.prototype.volumeup(); },
            'j' : function(){ NDesc.prototype.volumedown(); },
            'h' : function(){ NDesc.prototype.seekleft(); },
            'l' : function(){ NDesc.prototype.seekright(); },
            'H' : function(){ NDesc.prototype.seek2top(); }   //Shift+H
        };
        var t = e.target;
        if( t.nodeType == 1 ){
           var pressKey = String.fromCharCode(e.which);
           if( typeof handler[pressKey] == "function" ){
               e.preventDefault();    //Stop Default Event
               handler[pressKey].apply();
           }
        }
    }

    var o = new NDesc();
 
 })();
