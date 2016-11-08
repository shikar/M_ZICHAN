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
        this.el.prepend(this.opts.tplMain)
      }
    , create: function(data) {
        var i,item
        this.el.find('.filter-selects').empty()
        for (i = 0; i < data.length; i++) {
          item = data[i]
          this.el.find('.thumbnail-breadcrumb ul').append($.sprintf(this.opts.tplItem, item))
        }
        this.el.find('.thumbnail-breadcrumb ul').append(this.opts.tplSelect)
        this.el.find('.thumbnail-breadcrumb ul').append(this.opts.tplSearch)
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
      tplMain   : '<div class="thumbnail-breadcrumb"><a href="javascript:void(null)" class="ctrl-left hide"><span class="glyphicon glyphicon-chevron-left"></span></a><a href="javascript:void(null)" class="ctrl-right hide"><span class="glyphicon glyphicon-chevron-right"></span></a><ul class="list-unstyled"></ul></div>'
    , tplItem   : '<li>%s</li>'
    , tplSelect : '<li class="filter-selects hide"></li>'
    , tplSearch : '<li class="form-inline"><div class="input-group input-group-sm"><input type="text" class="form-control" placeholder="搜索当前目录下"><span class="input-group-btn"><button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button></span></div></li>'
  }

  $.fn.ZCBreadcrumb.Constructor = ZCBreadcrumb

}(window.jQuery);