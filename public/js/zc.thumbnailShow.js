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
    , create: function(id, catelog, ajaxUrl, murlnum) {
        var hash = window.location.hash
          , arr = hash.split('_')

        this.ajaxUrl = (ajaxUrl||this.opts.rootUrl + this.opts.ajaxUrl)
        this.catelog = (catelog||"")

        if (arr.length > 3 && arr[0] == '#m') {
          this.catelog = arr[5]
          if (murlnum && murlnum > 0) {
            arr.splice(murlnum)
            this.catelog = ""
            window.location.hash = arr.join('_')
          }
        }

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
            murl    : arr.join('_').replace('#',''),
            menu    : true
          },
          url      : this.ajaxUrl,
          success  : $.proxy(this.onThumbnailShowResult, this)
        })
      }
      /**
       * 根据目录 ID 刷新右边组件, 返回的 json 结构参照 thumbnailCatelog.json
       */
    , goCatelog: function(id, catelog, ajaxUrl) {
        this.el.find('input[name=search]').val('')
        this.ajaxUrl = (ajaxUrl||this.ajaxUrl)
        this.catelog = (catelog||"")
        this.page = 1
        this.el.find('.thumbnail-main').ZCTable('loading')
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
              id      : this.id,
              catelog : this.catelog,
              murl    : window.location.hash.replace('#',''),
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
        this.el.find('.thumbnail-main').ZCTable('loading')
        $.ajax({
          cache    : false,
          dataType : "json",
          data     : {
              id      : this.id,
              catelog : this.catelog,
              murl    : window.location.hash.replace('#',''),
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

    , onThumbnailShowResult: function(json) {
        if (this.checkReturn(json)) return
        this.ajaxData = json
        this.el.empty().append(this.opts.tplMain)
        if (json.hasOwnProperty('menu')) this.el.find('.row>div').ZCCatalog('create', json.menu)
        else this.el.find('.thumbnail-main').addClass('no-thumbnail-menu')
        if (json.hasOwnProperty('breadcrumb')) {
          if (json.breadcrumb.searchcontent)
            this.search = json.breadcrumb.searchcontent
          this.el.find('.row>div').ZCBreadcrumb('create', json.breadcrumb)
        }

        this.el.find('.thumbnail-main').ZCTopInfo('clear')
          .ZCFilter('clear')
          .ZCSort('clear')
          .ZCTable('clear')
          .ZCPagination2('clear')

        if (json.hasOwnProperty('info')) this.el.find('.thumbnail-main').ZCTopInfo('create', json.info)
        if (json.hasOwnProperty('filter')) this.el.find('.thumbnail-main').ZCFilter('create', json.filter)
        if (json.hasOwnProperty('sort')) this.el.find('.thumbnail-main').ZCSort('create', json.sort)
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onThumbnailCatalogResult: function(json) {
        if (this.checkReturn(json)) return
        if (json.hasOwnProperty('breadcrumb')) {
          if (json.breadcrumb.searchcontent)
            this.search = json.breadcrumb.searchcontent
          this.el.find('.row>div').ZCBreadcrumb('create', json.breadcrumb)
        }

        this.el.find('.thumbnail-main').ZCTopInfo('clear')
          .ZCFilter('clear')
          .ZCSort('clear')
          .ZCTable('clear')
          .ZCPagination2('clear')

        if (json.hasOwnProperty('info')) this.el.find('.thumbnail-main').ZCTopInfo('create', json.info)
        if (json.hasOwnProperty('filter')) this.el.find('.thumbnail-main').ZCFilter('create', json.filter)
        if (json.hasOwnProperty('sort')) this.el.find('.thumbnail-main').ZCSort('create', json.sort)
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onThumbnailTableResult: function(json) {
        if (this.checkReturn(json)) return
        console.log( json.info)
        if (json.hasOwnProperty('info')) this.el.find('.thumbnail-main').ZCTopInfo('create', json.info)
        if (json.hasOwnProperty('table')) this.el.find('.thumbnail-main').ZCTable('create', json.table)
        if (json.hasOwnProperty('page')) this.el.find('.thumbnail-main').ZCPagination2('create', json.page)
      }
    , onCatalogResult: function(e) {
        console.log('onCatalogResult:'+this.id+'|'+e.key+'|'+e.url)
        this.goCatelog(this.id, e.key, e.url)
      }

    , onSortResult: function(e) {
        e.stopPropagation()
        console.log(e.list)
        this.sort = JSON.stringify(e.list)
        this.page = 1
        this.refreshTable()
      }
    , onActResult: function(e) {
        console.dir(e);
        var murlnum = e.murlnum || -1
        switch (e.cmd) {
          case 'link':
          case 'list':
          case 'table':
            if (e.utype == 'ajax')
              this.create(this.id, undefined, e.url, murlnum)
            else if (e.utype == 'popup') {
              $.fn.ZCModal({
                title  : '加载中',
                size   : 'large',
                remote : e.url,
                body   : '请稍后,加载中...'
              })
            }
            break
        }
        // console.log('cmd:' + e.cmd + '|key:' + e.key + '|idx:' + e.idx)
        // e.stopPropagation()
      }
    , onPageResult: function(e) {
        e.stopPropagation()
        console.log(e.page)
        this.page = e.page
        this.refreshTable()
      }
    , onFilterResult: function(e) {
        e.stopPropagation()
        console.log(e.selected)
        this.filter = JSON.stringify(e.selected)
        this.page = 1
        this.refreshTable()
      }
    , onSearchResult: function(e) {
        e.stopPropagation()
        console.log('onSearchResult')
        this.search = e.search
        this.page = 1
        this.refreshTable()
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
