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
        var i,j,item,subitem
        for (i = 0; i < data.length; i++) {
          item = data[i]
          this.el.find('.thumbnail-menu')
            .append($.sprintf(this.opts.tplItem, item.id, item.name))
            .find('li:last').append('<ul></ul>')
          for (j = 0; j < item.list.length; j++) {
            subitem = item.list[j]
            this.el.find('.thumbnail-menu>li:last>ul').append($.sprintf(this.opts.tplItem, subitem.id, subitem.name))
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
    , tplItem   : '<li data-id="%s"><a href="javascript:void(null)">%s</a></li>'
  }

  $.fn.ZCCatalog.Constructor = ZCCatalog

}(window.jQuery);