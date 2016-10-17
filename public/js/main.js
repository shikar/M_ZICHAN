!function ($) {

  "use strict";

  var Main = function (el, opts) {
    this.opts = opts
    this.loadCount = 0;

    this.loadBlock();
  }

  Main.prototype = {

      constructor: Main
    , loadBlock: function () {
        var urlPath = '';
        if (navigator.userAgent.toLowerCase().match(/chrome/) != null) urlPath = this.opts.gitUrl;

        $( "#header-block" ).load( urlPath+"header.html", $.proxy(this.evtLoadedBlock, this));
        $( "#menu-block" ).load( urlPath+"menu.html", $.proxy(this.evtLoadedBlock, this));
        $( "#right-block" ).load( urlPath+"right.html", $.proxy(this.evtLoadedBlock, this));
      }
    , init: function() {
        Holder.run();
        this.createRightBlock();
      }
    , createRightBlock: function () {
        $('[data-toggle="popover-focus"]').each(function(idx, el){
          var cur = $(el);
          cur.data({
            'trigger': 'focus',
            'container': 'body',
            'html': true,
            'placement': 'left',
            'content': $(cur.data('target')).html()
          });
        }).popover();
        $('#right-block').on('mouseenter','.list-group-item',function(e){
          $(e.target).focus();
        });
      }
    , evtLoadedBlock: function(e) {
        this.loadCount++;
        if (this.loadCount == 3) this.init();
      }
  }

  $.fn.main = function (option) {
    var $this = $(this)
      , data = $this.data('main')
      , opts = $.extend({}, $.fn.main.defs, typeof option == 'object' && option)
    if (!data) $this.data('main', (data = new Main(this, opts)))
    if (typeof option == 'string') data[option]()
  }

  $.fn.main.defs = {
    gitUrl: 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
  }

  $.fn.main.Constructor = Main

  $.fn.main()
}(window.jQuery);