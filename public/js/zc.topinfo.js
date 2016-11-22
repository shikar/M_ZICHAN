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
        this.el.find('.btn-open').bind('click', $.proxy(this.onOpenClick, this))
      }
    , create: function(data) {
        var key,curDl
          , i = 0
        this.data = data
        this.el.find('.block-info dl').empty()

        for (key in this.data) {
          curDl = this.el.find('dl:eq('+i%2+')')
          curDl.append($.sprintf(this.opts.tplItem, this.data[key]['name']+':', this.data[key]['value']))
          i++
        }
      }

    , onOpenClick: function(e) {
        var self = $(e.currentTarget)
          , icon = self.find('span')
        if (icon.hasClass(this.opts.iconOpen)) {
          icon.removeClass(this.opts.iconOpen)
              .addClass(this.opts.iconClose)
          this.el.find('.panel-body').removeClass(this.opts.clsClose)
        } else {
          icon.removeClass(this.opts.iconClose)
              .addClass(this.opts.iconOpen)
          this.el.find('.panel-body').addClass(this.opts.clsClose)
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
      data      : null
    , tplMain   : '<div class="panel panel-default block-info"><div class="panel-body panel-close container-fluid"><div class="row"><div class="col-xs-6"><dl class="dl-horizontal"></dl></div><div class="col-xs-6"><button type="button" class="btn btn-link btn-open"><span class="glyphicon glyphicon-menu-down"></span></button><dl class="dl-horizontal"></dl></div></div></div></div>'
    , tplItem   : '<dt>%s</dt><dd>%s</dd>'
    , iconOpen  : 'glyphicon-menu-down'
    , iconClose : 'glyphicon-menu-up'
    , clsClose  : 'panel-close'
  }

  $.fn.ZCTopInfo.Constructor = ZCTopInfo

}(window.jQuery);