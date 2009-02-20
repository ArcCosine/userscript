// ==UserScript==
// @name      Outputz for Opera
// @author    mallowlabs (http://d.hatena.ne.jp/mallowlabs)
//            http://outputz.com
// @include   http://outputz.com/*
//
// ------ Add urls to track your inputs ------
// @include   http://twitter.com/home
// @include   http://d.hatena.ne.jp/*/edit
// -------------------------------------------
// ==/UserScript==

(function() {
    /**
     * secret key for Outputz
     */
    var SECRET_KEY = "YOUR_SECRET_KEY";

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
     * Outputz Object for postMessage
     */
    var ELEMENT_ID = 'user_js_opera_messenger';

    /**
     * Add Outputz Object to parent node
     */
    var addMessageWindow = function(uri, parent) {
        parent || (parent = document.body);
        var object = document.createElement('object');
        object.id = ELEMENT_ID;
        object.setAttribute('style','margin:0;padding:0;border:none;height:0px;width:0px;visibility:none;');
        object.data = uri;
        parent.appendChild(object);
    }

    /**
     * post Message
     */
    var postMessage = function(message) {
        if( message != 0 ){
            document.getElementById(ELEMENT_ID).contentWindow.postMessage(encodeURIComponent(message), '*');
        }
    }

    if (location.host == 'outputz.com') {
        document.addEventListener('message',
        function (e) {
            var url = 'http://outputz.com/api/post';
            var x = new XMLHttpRequest();
            x.open('POST', url, true);
            x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var uri = encodeURI(e.uri);
            x.send('key=' + SECRET_KEY + '&uri=' + uri + '&size=' + e.data);
        },
        false);
    } else {
        var forms = $X("//form[@method=\"post\"]"); // $X("//form")
        if (forms.length > 0) {
            addMessageWindow('http://outputz.com/?from=userjs');
        }
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
    }
})();
