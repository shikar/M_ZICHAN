!function ($) {

  "use strict"

  var ZCCatalog = function (el, opts) {
    this.opts = opts
    this.el = el

    this.init()
  }

  ZCCatalog.prototype = {

      constructor: ZCCatalog
    , init: function() {
        this.el.prepend(this.opts.tplMain)
      }
    , create: function(data) {
        var i,j,item
        for (i = 0; i < 3; i++) {
          // item = data[i]
          this.el.find('.thumbnail-menu')
            .append($.sprintf(this.opts.tplItem, i, '目录'+i))
            .find('li:last').append('<ul></ul>')
          for (j = 0; j < 3; j++) {
            this.el.find('.thumbnail-menu>li:last>ul').append($.sprintf(this.opts.tplItem, j, '目录'+i+'_'+j))
          }
        }
        this.el.find('.thumbnail-menu>li').bind('click', $.proxy(this.onOpenClick, this))
      }
    , onOpenClick: function(e) {
        var self = $(e.currentTarget)
        this.el.find('.thumbnail-menu>li').removeClass('act')
        self.addClass('act')
      }
  }

  $.fn.ZCCatalog = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCCatalog')
      , opts = $.extend({}, $.fn.ZCCatalog.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCCatalog', (data = new ZCCatalog($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCCatalog.defs = {
      tplMain   : '<ul class="thumbnail-menu"></ul>'
    , tplItem   : '<li data-id="%s"><a href="javascript:void">%s</a></li>'
  }

  $.fn.ZCCatalog.Constructor = ZCCatalog

}(window.jQuery);