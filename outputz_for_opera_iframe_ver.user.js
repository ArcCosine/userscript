// ==UserScript==
// @name      Outputz for Opera iframe ver 
// @author    mallowlabs (http://d.hatena.ne.jp/mallowlabs) / modified by Arc Cosine
// @include   http://outputz.com/*
// ------ Add urls to track your inputs ------
// @include   http://twitter.com/home
// @include   http://d.hatena.ne.jp/*/edit
// -------------------------------------------
// ==/UserScript==

(function() {
    /**
     * secret key for Outputz
     */
    var SECRET_KEY = "Your Secret Key";

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

    /**
     * post Message
     */
    var postMessage = function(message) {
        if( message != 0 ){
          var iframe = document.createElement('iframe');
          iframe.name = 'outputz_for_iframe';
          iframe.style.display = 'none';
          var url = 'http://outputz.com/api/post?key=' + SECRET_KEY + '&uri=' + location.href + '&size=' + message;

          var form = document.createElement('form');
          form.action = url;
          form.target = 'outputz_for_iframe';
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
            }
          };
          document.body.appendChild(iframe);
        }
    }

    var forms = $X("//form[@method=\"post\"]"); // $X("//form")
    forms.forEach(
      function (form) {
        form.addEventListener('submit',
          function (e) {
            var sum = 0;
            $X(".//input[not(@type) or @type=\"text\"]").concat($X(".//textarea")).forEach(
              function (input) {sum += input.value.length; }
            );
            postMessage(sum);
          },
        false);
      }
    );
})();
