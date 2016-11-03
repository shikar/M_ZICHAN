!function ($) {

  "use strict"

  var ZCItemList = function (el, opts) {
    this.opts = opts
    this.el = el
    this.menuData = []
  }

  ZCItemList.prototype = {

      constructor: ZCItemList
    , show: function(data) {
        var i,item
        this.el.empty().append(this.opts.tplMain)
        for (var i = 0; i < data.length; i++) {
          item = data[i]
          this.el.find('.item-list').append($.sprintf(this.opts.tplThumbnail, 'holder.js/150x150?random=yes&size=1&text=150x150 \\n '+item.name, item.name, item.ds))
        }
        Holder.run()
      }
  }

  $.fn.ZCItemList = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCItemList')
      , opts = $.extend({}, $.fn.ZCItemList.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCItemList', (data = new ZCItemList($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
  }

  $.fn.ZCItemList.defs = {
      tplMain      : '<div class="container-fluid"><div class="row item-list"></div><div class="col-sm-12 text-center page"></div></div>'
    , tplThumbnail : '<div class="col-sm-3"><div class="thumbnail"><img data-src="%s"><div class="caption"><h5>%s</h5><p class="text-muted small">%s</p></div></div></div>'
  }

  $.fn.ZCItemList.Constructor = ZCItemList

}(window.jQuery);