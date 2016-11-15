!function ($) {

  "use strict"

  var ZCFav = function (el, opts) {
    this.el = el
    this.opts = opts
    this.favData = null

    this.checkLoacAccessUrl()
    this.init()
  }

  ZCFav.prototype = {

      constructor: ZCFav
    , init: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          url      : this.opts.rootUrl + this.opts.ajaxFav,
          success  : $.proxy(this.onAjaxFavResult, this)
        })
      }
    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }

    , onAjaxFavResult: function(json) {
        var i,item
        this.favData = json
        this.el.empty()
        for (i = 0; i < this.favData.length; i++) {
          item = this.favData[i]
          this.el.append($.sprintf(
            this.opts.tplFavItem,
            item.id,
            item.url,
            item.type,
            item.url,
            item.name,
            'img/'+item.icon,
            item.name
          ))
        }
        if (this.favData.length >= 3)
          this.el.removeClass('col1').addClass('col3')
        else if (this.favData.length >= 2)
          this.el.removeClass('col1').addClass('col2')

        this.el.find('li').bind('click', $.proxy(this.onFavClick, this))
      }
    , onFavClick: function(e) {
        var self  = $(e.currentTarget)
          , key   = self.data('key')
          , url   = self.data('url')
          , type  = self.data('type')


        if (type == 'blank') self.find('a').attr({target: '_blank'})
        if (type == 'open' || type == 'blank') return true

        $(document).trigger({
          type  : "thumbnailShow",
          key   : key,
          url   : url,
          utype : type
        })
        return false
      }
  }

  $.fn.ZCFav = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCFav')
      , opts = $.extend({}, $.fn.ZCFav.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCFav', (data = new ZCFav($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
  }

  $.fn.ZCFav.defs = {
      rootUrl    : ''
    , ajaxFav    : 'json/fav.json'
    , tplFavItem : '<li data-key="%s" data-url="%s" data-type="%s"><a href="%s" title="%s"><img src="%s" class="img-responsive"><span class="txt">%s</span></a></li>'
  }

  $.fn.ZCFav.Constructor = ZCFav

}(window.jQuery);