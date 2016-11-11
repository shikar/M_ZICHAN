!function ($) {

  "use strict"

  var ZCFav = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''
    this.favData = null

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCFav.prototype = {

      constructor: ZCFav
    , init: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          url      : this.urlPath + this.opts.ajaxFav,
          success  : $.proxy(this.onAjaxFavResult, this)
        })
      }

    , onAjaxFavResult: function(json) {
        var i,item
        this.favData = json
        this.el.empty()
        for (i = 0; i < this.favData.length; i++) {
          item = this.favData[i]
          this.el.append($.sprintf(this.opts.tplFavItem, item.id, item.name, 'holder.js/80x80?random=yes', item.name))
        }
        if (this.favData.length >= 3)
          this.el.removeClass('col1').addClass('col3')
        else if (this.favData.length >= 2)
          this.el.removeClass('col1').addClass('col2')

        Holder.run()

        this.el.find('li').bind('click', $.proxy(this.onFavClick, this))
      }
    , onFavClick: function(e) {
        var self = $(e.currentTarget)
        $(document).trigger({
          type : "thumbnailShow",
          key  : self.data('id')
        })
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
      localAccessUrl   : 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , ajaxFav          : 'json/fav.json'
    , tplFavItem       : '<li data-id="%s"><a href="javascript:void(null)" title="%s"><img src="%s"><span class="txt">%s</span></a></li>'
  }

  $.fn.ZCFav.Constructor = ZCFav

}(window.jQuery);