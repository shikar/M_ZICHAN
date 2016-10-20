!function ($) {

  "use strict"

  var ZCMain = function (el, opts) {
    this.opts = opts
    this.loadCount = 0
    this.urlPath = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) urlPath = this.opts.localAccessUrl

    this.loadBlock()
  }

  ZCMain.prototype = {

      constructor: ZCMain
    , init: function() {
        Holder.run()
        this.initTopSearch()
        this.initRightBlock()


        $('#main-block').bind({
            go1: $.proxy(this.onResultSearch, this)
          , go1: $.proxy(this.onResult, this)
        })
      }


    /* 检测载入情况 */
    , loadBlock: function () {
        $( "#header-block" ).load( this.urlPath + this.opts.includeHeader, $.proxy(this.onLoadedBlock, this))
        $( "#menu-block" ).load( this.urlPath + this.opts.includeMenu, $.proxy(this.onLoadedBlock, this))
        $( "#right-block" ).load( this.urlPath + this.opts.includeRight, $.proxy(this.onLoadedBlock, this))
      }
    , onLoadedBlock: function(e) {
        this.loadCount++
        if (this.loadCount == 3) this.init()
      }



    /* 加载顶部搜索 */
    , initTopSearch: function() {
        // 输入框监听
        $('#top-search input[name=key]').bind({
          input: $.proxy(this.onTopSearchInput, this),
          blur: $.proxy(this.onTopSearchBlur, this),
          keyup: $.proxy(this.onTopSearchKeyup, this),
        })
        // 搜索提示框
        $('#top-search .search-tip').on('click', 'li a', $.proxy(this.onSearchTipSel, this))
        // 提交搜索
        $('#top-search .btn-search').bind('click', $.proxy(this.onTopSearchClick, this))
        // 目录选择
        $('#top-search .search-type-option').bind('click', $.proxy(this.onTopSearchSelect, this))
      }
    , onTopSearchClick: function(e) {
        $('#top-search input[name=key]').val()
        $('#top-search input[name=type]').val()
      }
    , onTopSearchSelect: function(e) {
        var self = $(e.currentTarget)
        $('#top-search .dropdown-toggle .txt').text(self.text())
        $('#top-search input[name=key]').attr('placeholder', self.data('placeholder'))
        $('#top-search input[name=type]').val(self.data('val'))
      }
    , onTopSearchInput: function(e) {
        var self = $(e.currentTarget)
        $.ajax({
          url: this.urlPath + this.opts.searchTipAjax,
          dataType: "json",
          data: {search: self.val()},
          success: $.proxy(this.onSearchTipAjaxResult, this)
        })
      }
    , onSearchTipAjaxResult: function(json) {
        if (json.length > 0) {
          $('#top-search .search-tip').empty()
          for (var i = 0; i < json.length; i++) $('#top-search .search-tip').append($.sprintf(this.opts.searchTipTpl, json[i]))
          $('#top-search .search-tip').css({
            left: $('#top-search input[name=key]').position().left,
            width: $('#top-search input[name=key]').outerWidth()
          })
          $('#top-search .search-tip').show()
        } else {
          $('#top-search .search-tip').empty().hide()
        }
      }
    , onSearchTipSel: function(e) {
        var self = $(e.currentTarget)
        $('#top-search input[name=key]').val(self.text())
        $('#top-search .search-tip').empty().hide()
      }
    , onTopSearchBlur: function(e) {
        $('#top-search .search-tip').hide()
      }
    , onTopSearchKeyup: function(e) {

      }



    /* 创建右边浮动栏 */
    , initRightBlock: function () {
        $('[data-toggle="popover-focus"]').each(function(idx, el){
          var cur = $(el)
          cur.data({
            'trigger': 'focus',
            'container': 'body',
            'html': true,
            'placement': 'left',
            'content': $(cur.data('target')).html()
          })
        }).popover()
        $('#right-block').on('mouseenter','.list-group-item',function(e){
          $(e.target).focus()
        })
      }



    , onMainResult: function(e) {
        switch (e.type) {
          case 'go1':
            break;
          case 'go1':
            break;
        }
      }
  }

  $.fn.ZCMain = function (option) {
    var $this = $(this)
      , data = $this.data('ZCMain')
      , opts = $.extend({}, $.fn.ZCMain.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCMain', (data = new ZCMain(this, opts)))
    if (typeof option == 'string') data[option]()
  }

  $.fn.ZCMain.defs = {
      localAccessUrl: 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , includeHeader: 'header.html'
    , includeMenu: 'menu.html'
    , includeRight: 'right.html'
    , searchTipAjax: 'json/searchTip.json'
    , searchTipTpl: '<li><a href="javascript:void(null)">%s</a></li>'
  }

  $.fn.ZCMain.Constructor = ZCMain

}(window.jQuery);