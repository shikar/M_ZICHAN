!function ($) {

  "use strict"

  var ZCTopSearch = function (el, opts) {
    this.el = el
    this.opts = opts

    this.checkLoacAccessUrl()
  }

  ZCTopSearch.prototype = {

      constructor: ZCTopSearch

    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }
      /**
       * 根据结果创建组件
       * @param  {Object} data json
       */
    , create: function(data) {
        this.el.empty()
        var i,row
          , html = ''
          , list = ''
        this.opts.key = data.key
        this.opts.type = data.type

        $('#main-block').ZCItemList({rootUrl:this.opts.rootUrl}).ZCItemList('show', data.list)

        this.el.find('.page')
          .ZCPagination1('create', data.page)
          .bind('onPage', $.proxy(this.onPageClick, this))
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
      /**
       * 搜索调用
       * @param  {String} key  搜索关键字
       * @param  {string} type 搜索类别(all|cur)
       * @param  {Number} page 第几页 默认:1
       */
    , goSearch: function(key, type, page) {
        window.location.hash = ''
        this.el.html(this.opts.loadHtml)
        page = page||1
        $.ajax({
          url      : this.opts.rootUrl + this.opts.ajaxSearchResult,
          dataType : "json",
          cache    : false,
          data     : {key:key, type:type, page:page,m:window.location.hash},
          success  : $.proxy(this.onAjaxSearchResult, this)
        })
      }

    , onAjaxSearchResult: function(json) {
        if (this.checkReturn(json)) return
        this.create(json)
      }
    , onPageClick:function(e) {
        this.goSearch(this.opts.key, this.opts.type, e.page)
      }

  }

  $.fn.ZCTopSearch = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCTopSearch')
      , opts = $.extend({}, $.fn.ZCTopSearch.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCTopSearch', (data = new ZCTopSearch($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCTopSearch.defs = {
      rootUrl          : ''
    , loadHtml         : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , ajaxSearchResult : 'json/searchResult.json'
    , key              : ''
    , type             : 'all'
    , page             : 1
  }

  $.fn.ZCTopSearch.Constructor = ZCTopSearch

}(window.jQuery);