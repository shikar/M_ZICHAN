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
    , checkReturn: function(json) {
        if (json.errflag === 1) {
          window.location.reload()
          return true
        } else if (json.errflag !== 0 && json.msg != null) {
          $.notify('提示信息: '+json.msg, {
            className: 'error',
            clickToHide: true,
            globalPosition: 'bottom right',
            gap: 2
          })
          return false
        } else if (json.errflag === 0 && json.msg != null) {
          $.notify('提示信息: '+json.msg, {
            className: 'success',
            clickToHide: true,
            globalPosition: 'bottom right',
            gap: 2
          })
          return false
        }
        return false
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 1 && arr[0] == '#f') {
          this.el.find('li[data-key='+arr[1]+']').trigger('click', [true])
        }
      }

    , onAjaxFavResult: function(json) {
        if (this.checkReturn(json)) return
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

        this.checkHash()
      }
    , onFavClick: function(e, auto) {
        var self  = $(e.currentTarget)
          , key   = self.data('key')
          , url   = self.data('url')
          , type  = self.data('type')

        if (!auto) window.location.hash = '#f_' + key
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