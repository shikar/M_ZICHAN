!function ($) {

  "use strict"

  var ZCThumbnailShow = function (el, opts) {
    this.el       = el
    this.opts     = opts
    this.ajaxData = null

    this.id      = 0
    this.catelog = 0
    this.filter  = []
    this.sort    = []
    this.page    = 1
    this.search  = ''

    this.ajaxUrl = ''

    this.checkLoacAccessUrl()
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
    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }
      /**
       * 表格界面显示包括所有的组件, 返回的 json 结构参照 thumbnailShow.json
       * @param  {number} id      表格界面调用的依据
       * @param  {[type]} ajaxUrl 自定义的 ajax 地址
       */
    , create: function(id, catelog, ajaxUrl) {
        var hash = window.location.hash
          , arr = hash.split('_')

        this.ajaxUrl = (ajaxUrl||this.opts.rootUrl + this.opts.ajaxUrl)
        this.catelog = (catelog||0)

        if (arr.length > 3 && arr[0] == '#m')
          this.catelog = arr[5]

        this.el.empty().append(this.opts.loadHtml)
        this.id     = id
        this.filter = []
        this.sort   = []
        this.page   = 1
        this.search = ''
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
            id      : this.id,
            catelog : this.catelog,
            menu    : true
          },
          url      : this.ajaxUrl,
          success  : $.proxy(this.onThumbnailShowResult, this)
        })
      }
      /**
       * 根据目录 ID 刷新右边组件, 返回的 json 结构参照 thumbnailCatelog.json
       */
    , goCatelog: function(catelog) {
        this.catelog = catelog
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
              id      : this.id,
              catelog : this.catelog,
              menu    : false
            },
          url      : this.ajaxUrl,
          success  : $.proxy(this.onThumbnailCatalogResult, this)
        })
      }

      /**
       * 有条件的查询,只更新表格和分页组件, 返回的 json 结构参照 thumbnailTable.json
       */
    , refreshTable: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
              id      : this.id,
              catelog : this.catelog,
              menu    : false,
              filter  : this.filter,
              sort    : this.sort,
              page    : this.page,
              search  : this.search
            },
          url      : this.ajaxUrl,
          success  : $.proxy(this.onThumbnailTableResult, this)
        })
      }

    , onThumbnailShowResult: function(json) {
        this.ajaxData = json
        this.el.empty().append(this.opts.tplMain)
        if (json.hasOwnProperty('menu')) this.el.find('.row>div').ZCCatalog('create', json.menu)
        else this.el.find('.thumbnail-main').addClass('no-thumbnail-menu')
        if (json.hasOwnProperty('breadcrumb')) this.el.find('.row>div').ZCBreadcrumb('create', json.breadcrumb)
        if (json.hasOwnProperty('info')) this.el.find('.thumbnail-main').ZCTopInfo('create', json.info)
        if (json.hasOwnProperty('filter')) this.el.find('.thumbnail-main').ZCFilter('create', json.filter)
        if (json.hasOwnProperty('sort')) this.el.find('.thumbnail-main').ZCSort('create', json.sort)
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onThumbnailCatalogResult: function(json) {
        if (json.hasOwnProperty('breadcrumb')) this.el.find('.row>div').ZCBreadcrumb('create', json.breadcrumb)
        if (json.hasOwnProperty('info')) this.el.find('.thumbnail-main').ZCTopInfo('create', json.info)
        if (json.hasOwnProperty('filter')) this.el.find('.thumbnail-main').ZCFilter('create', json.filter)
        if (json.hasOwnProperty('sort')) this.el.find('.thumbnail-main').ZCSort('create', json.sort)
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onThumbnailTableResult: function(json) {
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onCatalogResult: function(e) {
        console.log('onCatalogResult',e.key)
        this.goCatelog(e.key)
      }

    , onSortResult: function(e) {
        console.log(e.list)
        this.sort = JSON.stringify(e.list)
        this.refreshTable()
        e.stopPropagation()
      }
    , onActResult: function(e) {
        switch (e.cmd) {
          case 'link':
            if (e.menu != '')
              window.location.hash = '#'+e.menu
            this.create(e.key)
            break
          case 'list':
          case 'table':
            $.fn.ZCModal({
              title  : '加载中',
              size   : 'large',
              remote : e.url,
              body   : '请稍后,加载中...'
            })
            break
        }
        // console.log('cmd:' + e.cmd + '|key:' + e.key + '|idx:' + e.idx)
        // e.stopPropagation()
      }
    , onPageResult: function(e) {
        console.log(e.page)
        this.page = e.page
        this.refreshTable()
        e.stopPropagation()
      }
    , onFilterResult: function(e) {
        console.log(e.selected)
        this.filter = JSON.stringify(e.selected)
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
    return $this
  }

  $.fn.ZCThumbnailShow.defs = {
      rootUrl  : ''
    , ajaxUrl  : 'json/thumbnailShow.json'
    , id       : 0
    , loadHtml : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , tplMain  : '<div class="container-fluid"><div class="row"><div class="col-xs-12"><div class="thumbnail-main"></div></div></div></div>'
  }

  /**
   * thumbnail show json 的结构说明
   * info: 顶部的信息数据
   * menu: 右边的目录 4-5
   *   open: 默认打开的
   *   list: 目录数据
   * filter: 筛选数据
   * breadcrumb: 导航栏数据
   * sort: 排序数据
   * table: 表格数据
   *   info: 配置
   *     checkbox: 是否显示 checkbox
   *     keyword: 高亮字段
   *     listbtn: 记录按钮
   *     tablebtn: 列表按钮
   *   fields: 字段名
   *   lists: 数据列表
   * page: 分页数据
   */

  $.fn.ZCThumbnailShow.Constructor = ZCThumbnailShow

}(window.jQuery);