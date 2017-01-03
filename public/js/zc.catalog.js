!function ($) {

  "use strict"

  var ZCCatalog = function (el, opts) {
    this.opts = opts
    this.el = el
    this.menuData = null

    this.init()
  }

  ZCCatalog.prototype = {

      constructor: ZCCatalog
    , init: function() {
        this.el.prepend(this.opts.tplMain)
      }
    , create: function(data) {
        var i,j,item,subitem
          , list = data.list
        this.menuData = data
        for (i = 0; i < list.length; i++) {
          item = list[i]
          this.el.find('.thumbnail-menu')
            .append($.sprintf(this.opts.tplItem, item.id, '', '', item.name))
            .find('li:last').append('<ul></ul>')
          for (j = 0; j < item.list.length; j++) {
            subitem = item.list[j]
            this.el.find('.thumbnail-menu>li:last>ul').append($.sprintf(this.opts.tplItem, subitem.id, subitem.type, subitem.url, subitem.name))
          }
        }
        this.el.find('.thumbnail-menu>li').bind('click', $.proxy(this.onOpenClick, this))
        this.el.find('.thumbnail-menu>li li a').bind('click', $.proxy(this.onGoClick, this))

        this.checkHash()
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 4 && arr[0] == '#m') {
          this.el.find('.thumbnail-menu>li[data-key='+arr[4]+']').trigger('click', [true])
          this.el.find('.thumbnail-menu>li[data-key='+arr[4]+'] li[data-key='+arr[5]+'] a').trigger('click', [true])
        } else if (this.menuData.hasOwnProperty('open')) {
          this.el.find('.thumbnail-menu>li[data-key='+this.menuData.open[0]+']').trigger('click', [true])
          this.el.find('.thumbnail-menu>li[data-key='+this.menuData.open[0]+'] li[data-key='+this.menuData.open[1]+'] a').trigger('click', [true])
        }
      }
    , checkLink: function(link) {
        var hash = window.location.hash
        if (hash.indexOf('#m') === 0)
          link = link.replace(/:murl/g, hash.replace('#', ''))
        return link
      }
    , onOpenClick: function(e) {
        var self = $(e.currentTarget)
        if (self.hasClass('act')) {
          this.el.find('.thumbnail-menu>li').removeClass('act')
        } else {
          this.el.find('.thumbnail-menu>li').removeClass('act')
          self.addClass('act')
        }
        return false
      }
    , onGoClick: function(e, auto) {
        var self   = $(e.currentTarget)
          , parent = self.parent('li')
          , pkey   = parent.parents('li').data('key')
          , key    = parent.data('key')
          , type   = parent.data('type')
          , url    = self.attr('href')
          , hash   = window.location.hash
          , arr    = hash.split('_')
        e.stopPropagation()
        self.attr('href', this.checkLink(url))
        this.el.find('.thumbnail-menu>li li').removeClass('act')
        parent.addClass('act')

        if (arr.length > 2 && arr[0] == '#m') {
          window.location.hash = '#m_' + arr[1] + '_' + arr[2] + '_' + (arr[3]||'') + '_' + pkey + '_' + key
        }

        if (type == 'blank') {
          self.attr({target: '_blank'})
          self.attr({href: self.attr('href')+window.location.hash})
        }
        if (type == 'open' || type == 'blank') return true


        /*if (!auto || !this.menuData.hasOwnProperty('open') || arr[4] != this.menuData.open[0] || arr[5] != this.menuData.open[1]) {*/
        if (!auto && arr.length > 2 && arr[0] == '#m') {
          this.el.trigger({
            type : 'onCatalog',
            key  : key,
            url  : url
          })
        }

        return false
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
    , tplItem   : '<li data-key="%s" data-type="%s"><a href="%s">%s</a></li>'
  }

  $.fn.ZCCatalog.Constructor = ZCCatalog

}(window.jQuery);
