!function ($) {

  "use strict"

  var ZCTopInfo = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''
    this.ajaxData = null

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCTopInfo.prototype = {

      constructor: ZCTopInfo
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , create: function(data) {
        var key,curDl
          , i = 0
        this.data = data
        this.el.find('dl').empty()

        for (key in this.data) {
          curDl = this.el.find('dl:eq('+i%2+')')
          curDl.append($.sprintf(this.opts.tplItem, key+':', this.data[key]))
          i++
        }
      }
  }

  $.fn.ZCTopInfo = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCTopInfo')
      , opts = $.extend({}, $.fn.ZCTopInfo.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCTopInfo', (data = new ZCTopInfo($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCTopInfo.defs = {
      data        : null
    , tplMain     : '<div class="panel panel-default"><div class="panel-body container-fluid"><div class="row"><div class="col-xs-6"><dl class="dl-horizontal"></dl></div><div class="col-xs-6"><dl class="dl-horizontal"></dl></div></div></div></div>'
    , tplItem     : '<dt>%s</dt><dd>%s</dd>'
  }

  $.fn.ZCTopInfo.Constructor = ZCTopInfo

}(window.jQuery);