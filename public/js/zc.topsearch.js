!function ($) {

  "use strict"

  var ZCTopSearch = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
  }

  ZCTopSearch.prototype = {

      constructor: ZCTopSearch
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

        $('#main-block').ZCItemList('show', data.list)

        this.el.find('.page')
          .ZCPagination2('create', data.page)
          .bind('onPage', $.proxy(this.onPageClick, this))
        Holder.run()
      }
      /**
       * 搜索调用
       * @param  {String} key  搜索关键字
       * @param  {string} type 搜索类别(all|cur)
       * @param  {Number} page 第几页 默认:1
       */
    , goSearch: function(key, type, page) {
        this.el.html(this.opts.loadHtml)
        if (!page) page = 1
        $.ajax({
          url      : this.urlPath + this.opts.ajaxSearchResult,
          dataType : "json",
          cache    : false,
          data     : {key: key, type: type, page:page},
          success  : $.proxy(this.onAjaxSearchResult, this)
        })
      }

    , onAjaxSearchResult: function(json) {
        this.create(json)
      }
    , onPageClick:function(e, pNum) {
        this.goSearch(this.opts.key, this.opts.type, pNum)
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
  }

  $.fn.ZCTopSearch.defs = {
      localAccessUrl   : 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , loadHtml         : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , ajaxSearchResult : 'json/searchResult.json'
    , key              : ''
    , type             : 'all'
    , page             : 1
  }

  $.fn.ZCTopSearch.Constructor = ZCTopSearch

}(window.jQuery);