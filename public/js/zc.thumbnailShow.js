!function ($) {

  "use strict"

  var ZCThumbnailShow = function (el, opts) {
    this.el       = el
    this.opts     = opts
    this.urlPath  = ''
    this.ajaxData = null

    this.id     = 0
    this.filter = []
    this.sort   = []
    this.page   = 1
    this.search = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl

    this.init()
  }

  ZCThumbnailShow.prototype = {

      constructor: ZCThumbnailShow
    , init: function() {
        this.el.bind({
          'onSort'    : $.proxy(this.onSortResult, this),
          'onAct'     : $.proxy(this.onActResult, this),
          'onPage'    : $.proxy(this.onPageResult, this),
          'onFilter'  : $.proxy(this.onFilterResult, this),
          'onCatalog' : $.proxy(this.onCatalogResult, this),
          'onSearch'  : $.proxy(this.onSearchResult, this)
        })
      }
    , create: function(id) {
        this.el.empty().append(this.opts.loadHtml)
        this.id     = id
        this.filter = []
        this.sort   = []
        this.page   = 1
        this.search = ''
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {id: id},
          url      : this.urlPath + this.opts.ajaxUrl,
          success  : $.proxy(this.onThumbnailShowResult, this)
        })
      }
    , refreshTable: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
              id     : this.id,
              filter : this.filter,
              sort   : this.sort,
              page   : this.page,
              search : this.search
            },
          url      : this.urlPath + this.opts.ajaxTable,
          success  : $.proxy(this.onThumbnailTableResult, this)
        })
      }

    , onThumbnailShowResult: function(json) {
        this.ajaxData = json
        this.el.empty().append(this.opts.tplMain)
        this.el.find('.row>div')
          .ZCCatalog('create', json.menu)
          .ZCBreadcrumb('create', json.breadcrumb)
        this.el.find('.thumbnail-main')
          .ZCTopInfo('create', json.info)
          .ZCFilter('create', json.filter)
          .ZCSort('create', json.sort)
          .ZCTable('create', json.table)
          .ZCPagination2('create', json.page)
      }
    , onThumbnailTableResult: function(json) {
        this.el.find('.thumbnail-main')
          .ZCTable('create', json.table)
          .ZCPagination2('create', json.page)
      }
    , onCatalogResult: function(e) {
        this.create(e.key)
      }

    , onSortResult: function(e) {
        console.log(e.list)
        this.sort = e.list
        this.refreshTable()
        e.stopPropagation()
      }
    , onActResult: function(e) {
        console.log(e.key, e.idx)
        e.stopPropagation()
      }
    , onPageResult: function(e) {
        console.log(e.page)
        this.page = e.page
        this.refreshTable()
        e.stopPropagation()
      }
    , onFilterResult: function(e) {
        console.log(e.selected)
        this.filter = e.selected
        this.refreshTable()
        e.stopPropagation()
      }
    , onSearchResult: function(e) {
        console.log(e.search)
        this.search = e.search
        this.refreshTable()
        e.stopPropagation()
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
    , ajaxTable      : 'json/thumbnailTable.json'
    , id             : 0
    , loadHtml       : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , tplMain        : '<div class="container-fluid"><div class="row"><div class="col-xs-12"><div class="thumbnail-main"></div></div></div></div>'
  }

  $.fn.ZCThumbnailShow.Constructor = ZCThumbnailShow

}(window.jQuery);