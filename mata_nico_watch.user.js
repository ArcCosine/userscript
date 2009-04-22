// ==UserScript==
// @name      mata nico watch
// @namespace http://looxu.blogspot.com/
// @include   http://www.nicovideo.jp/watch/*
// @author    Arc Cosine
// @version   1.0
// ==/UserScript==
// License Public Domain
(function(){
  var MataNico = {
    send : function(){
      var bg = document.getElementById('mata_nico').style.backgroundColor;
      if( bg == "#fc9988" ){
        return;
      }
      var text = document.getElementById('mata_nico').value;
      text = (text.length>60) ? text.substring(0,60) : text;
      text = (text.length == 0) ? text : '「' + text + '」';

      var iframe = document.createElement('iframe');
      iframe.name = 'mata_nico_miteru';
      iframe.style.display = 'none';

      var url = 'http://twitter.com/statuses/update.xml?status=またニコニコ動画見てる:' + text + location.href;

      var form = document.createElement('form');
      form.action = url;
      form.target = 'mata_nico_miteru';
      form.method = 'POST';
      form.style.display = 'none';
      document.body.appendChild(form);

      var cnt = 0;
      var onload = iframe.onload = function(){
        if( cnt++ == 0 ){
          setTimeout( function(){ form.submit(); }, 0 );
        }else{
          iframe.parentNode.removeChild(iframe);
          form.parentNode.removeChild(form);
          var mn = document.getElementById('mata_nico');
          mn.value = '送信完了';
          mn.readOnly = true;
          mn.style.backgroundColor = '#fc9988';
        }
      };
      document.body.appendChild(iframe);
    },
    init : function(){
      var head = document.getElementsByTagName('h1')[0]
      //mata nico
      var input = document.createElement('input');
      input.id = 'mata_nico';
      input.autocomplete = 'off';
      input.style.backgroundColor = '#f6f6f6';

      head.parentNode.insertBefore(input, head);

      var btn = document.createElement('input');
      btn.type = 'button';
      btn.value = 'またニコ';
      btn.addEventListener('click',this.send, false);

      head.parentNode.insertBefore(btn, head);

    }
  };

  MataNico.init();

 })();
