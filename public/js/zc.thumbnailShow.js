!function ($) {

  "use strict"

  var ZCThumbnailShow = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''
    this.ajaxData = null

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCThumbnailShow.prototype = {

      constructor: ZCThumbnailShow
    , init: function() {
        this.el.empty().append(this.opts.loadhtml)
      }
    , create: function(id) {
        this.id = id
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {id: id},
          url      : this.urlPath + this.opts.ajaxUrl,
          success  : $.proxy(this.onThumbnailShowResult, this)
        })
      }

    , onThumbnailShowResult: function(json) {
        console.log(json)
        var i,item
        this.ajaxData = json
        this.el.empty().append(this.opts.tplMain)
        this.el.find('.row>div')
          .ZCSort('create', json.sort)
          .bind('onSort', $.proxy(this.onSortResult, this))
      }
    , onSortResult: function(e, sort) {
        console.log(sort.list)
      }
  }

  $.fn.ZCThumbnailShow = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCThumbnailShow')
      , opts = $.extend({}, $.fn.ZCThumbnailShow.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCThumbnailShow', (data = new ZCThumbnailShow($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
  }

  $.fn.ZCThumbnailShow.defs = {
      localAccessUrl : 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , ajaxUrl        : 'json/thumbnailShow.json'
    , id             : 0
    , loadHtml       : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , tplMain        : '<div class="container-fluid"><div class="row"><div class="col-xs-12">dd</div></div></div>'
  }

  $.fn.ZCThumbnailShow.Constructor = ZCThumbnailShow

}(window.jQuery);