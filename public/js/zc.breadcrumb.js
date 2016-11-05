!function ($) {

  "use strict"

  var ZCBreadcrumb = function (el, opts) {
    this.opts = opts
    this.el = el

    this.init()
  }

  ZCBreadcrumb.prototype = {

      constructor: ZCBreadcrumb
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , create: function(data) {
        var i,item
        this.el.empty().append(this.opts.tplMain)
        for (i = 0; i < data.length; i++) {
          item = data[i]
          this.el.find('.breadcrumb').append($.sprintf(this.opts.tplItem, (i < data.length-1?this.opts.tplActive:''), item))
        }
      }
  }

  $.fn.ZCBreadcrumb = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCBreadcrumb')
      , opts = $.extend({}, $.fn.ZCBreadcrumb.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCBreadcrumb', (data = new ZCBreadcrumb($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCBreadcrumb.defs = {
      tplMain   : '<ol class="breadcrumb"></ol>'
    , tplItem   : '<li%s>%s</li>'
    , tplActive : ' class="active"'
  }

  $.fn.ZCBreadcrumb.Constructor = ZCBreadcrumb

}(window.jQuery);