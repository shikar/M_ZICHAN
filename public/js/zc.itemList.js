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
          this.el.find('.item-list').append($.sprintf(
            this.opts.tplThumbnail,
            item.id,
            item.url,
            item.type,
            item.count,
            item.url,
            'img/'+item.icon,
            item.name,
            item.ds
          ))
        }

        this.el.find('.thumbnail').bind('click', $.proxy(this.onThumbnailClick, this))
        this.checkHash()
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 3 && arr[0] == '#m') {
          this.el.find('.thumbnail[data-key='+arr[3]+']').trigger('click', [true])
        }
      }
    , onThumbnailClick: function(e, auto) {
        var self = $(e.currentTarget)
          , key  = self.data('key')
          , url  = self.data('url')
          , type = self.data('type')
          , hash = window.location.hash
          , arr  = hash.split('_')

        if (!auto && arr.length > 2 && arr[0] == '#m') window.location.hash = '#m_' + arr[1] + '_' + arr[2] + '_' + key


        if (type == 'blank') {
          self.find('a').attr({target: '_blank'})
          self.attr({href: self.attr('href')+window.location.hash})
        }
        if (type == 'open' || type == 'blank') return true



        $(document).trigger({
          type  : "thumbnailShow",
          key   : key,
          url   : url,
          utype : type
        })

        return false;
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
      tplMain      : '<div class="container-fluid"><div class="row item-list"></div><div class="row"><div class="col-xs-12 page"></div></div></div>'
    , tplThumbnail : '<div class="col-sm-3"><div class="thumbnail" data-key="%s" data-url="%s" data-type="%s"><span class="badge">%s</span><a href="%s"><img src="%s"></a><div class="caption"><h5>%s</h5><p class="text-muted small">%s</p></div></div></div>'
  }

  $.fn.ZCItemList.Constructor = ZCItemList

}(window.jQuery);