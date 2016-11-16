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
        this.el.find('.thumbnail-menu>li li').bind('click', $.proxy(this.onGoClick, this))

        this.checkHash()
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 3 && arr[0] == '#m') {
          this.el.find('.thumbnail-menu>li[data-key='+arr[4]+']').trigger('click', [true])
          this.el.find('.thumbnail-menu>li[data-key='+arr[4]+'] li[data-key='+arr[5]+']').trigger('click', [true])
        }
      }
    , onOpenClick: function(e) {
        var self = $(e.currentTarget)
        if (self.hasClass('act')) {
          this.el.find('.thumbnail-menu>li').removeClass('act')
        } else {
          this.el.find('.thumbnail-menu>li').removeClass('act')
          self.addClass('act')
        }
      }
    , onGoClick: function(e, auto) {
        var self = $(e.currentTarget)
          , pkey = self.parents('li').data('key')
          , key  = self.data('key')
          , hash = window.location.hash
          , arr  = hash.split('_')

        this.el.find('.thumbnail-menu>li li').removeClass('act')
        self.addClass('act')

        if (!auto && arr.length > 2 && arr[0] == '#m') {
          window.location.hash = '#m_' + arr[1] + '_' + arr[2] + '_' + (arr[3]||'') + '_' + pkey + '_' + key
        }

        this.el.trigger({
          type : 'onCatalog',
          key  : key
        })

        e.stopPropagation()
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
    , tplItem   : '<li data-key="%s"><a href="javascript:void(null)">%s</a></li>'
  }

  $.fn.ZCCatalog.Constructor = ZCCatalog

}(window.jQuery);