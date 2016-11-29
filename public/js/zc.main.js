!function ($) {

  "use strict"

  var ZCMain = function (el, opts) {
    this.opts = opts
    this.loadCount = 0

    this.checkLoacAccessUrl()
    this.init()
  }

  ZCMain.prototype = {

      constructor: ZCMain
    , init: function() {
        $.ajaxSetup({
          cache    : false,
          dataType : "json"
        })
        Holder.run()
        $( ".main" ).ZCMenu({rootUrl: this.opts.rootUrl,ajaxMenu:this.opts.ajaxMenu})
        $( "#fav" ).ZCFav({rootUrl: this.opts.rootUrl,ajaxFav:this.opts.ajaxFav})
        this.initTopSearch()
        this.initPopover()


        $(document).bind({
            thumbnailShow : $.proxy(this.mainThumbnailShow, this)
          // , go1 : $.proxy(this.onResult, this)
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
          return true
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



    /* 加载顶部搜索 */
    , initTopSearch: function() {
        // 搜索提示框
        $('#top-search .search-tip').on('click', 'li a', $.proxy(this.onSearchTipSel, this))
        // 输入框监听
		/*
        $('#top-search input[name=key]').bind({
          input : $.proxy(this.onTopSearchInput, this),
          blur  : $.proxy(this.onTopSearchBlur, this),
          keyup : $.proxy(this.onTopSearchKeyup, this),
        })*/
        // 提交搜索
        $('#top-search .btn-search').bind('click', $.proxy(this.onTopSearchClick, this))
        // 目录选择
        $('#top-search .search-type-option li a').bind('click', $.proxy(this.onTopSearchSelect, this))
        // 热门搜索载入
		/*
        $.ajax({
          url     : this.opts.rootUrl + this.opts.ajaxSearchHot,
          success : $.proxy(this.onAjaxSearchHotResult, this)
        })
        $('#top-search .search-hot').on('click', 'li a', $.proxy(this.onSearchHotClick, this))
		*/
      }
      /**
       * 调用搜索结果接口
       * @param  {String} key  搜索关键字
       * @param  {string} type 搜索类别(all|cur)
       */
    , goSearch: function(key, type) {
        $('#main-block').ZCTopSearch({rootUrl:this.opts.rootUrl,ajaxSearchResult:this.opts.ajaxSearchResult}).ZCTopSearch('goSearch', key, type, 1);
      }
    , onTopSearchClick: function(e) {
        this.goSearch($('#top-search input[name=key]').val(), $('#top-search input[name=type]').val());
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
          url     : this.opts.rootUrl + this.opts.ajaxSearchTip,
          data    : {search: self.val(), type:$('#top-search input[name=type]').val()},
          success : $.proxy(this.onAjaxSearchTipResult, this)
        })
      }
    , onSearchHotClick: function(e) {
        var self = $(e.currentTarget)
        this.goSearch(self.text(), 'all');
      }
    , onAjaxSearchHotResult: function(json) {
        if (this.checkReturn(json)) return
        if (json.length <= 0) return
        for (var i = 0; i < json.length; i++)
          $('#top-search .search-hot').append($.sprintf(this.opts.tplSearchHot, json[i]))
      }
    , onAjaxSearchTipResult: function(json) {
        if (this.checkReturn(json)) return
        var $searchTip = $('#top-search .search-tip')
        if (json.length > 0) {
          $searchTip.empty()
          for (var i = 0; i < json.length; i++)
            $searchTip.append($.sprintf(this.opts.tplSearchTip, json[i]))
          $('#top-search .search-tip').css({
            left  : $('#top-search input[name=key]').position().left,
            width : $('#top-search input[name=key]').outerWidth()
          })
          $searchTip.show()
        } else {
          $searchTip.empty().hide()
        }
      }
    , onSearchTipSel: function(e) {
        var self = $(e.currentTarget)
        $('#top-search input[name=key]').val(self.text())
        $('#top-search .search-tip').empty().hide()
      }
    , onTopSearchBlur: function(e) {
        $('#top-search .search-tip').hide(500)
      }
    , onTopSearchKeyup: function(e) {

      }



    /* 创建 HTML Popover */
    , initPopover: function () {
        $('[data-toggle="popover-html"][data-html="true"]').each(function(idx, el){
          var cur = $(el)
          cur.data({
            'content' : $(cur.data('target')).html()
          })
        }).popover()
        // $('[data-toggle="popover"]').popover()
        $('[data-toggle="popover-html"][data-trigger="focus"]').bind('mouseenter', function(e){
          $(e.target).focus()
        })
      }


    /**
     * 图标点击后的统一调用接口
     * @param  {string} e.key 菜单识别
     * @param  {string} e.url ajax地址(默认为空)
     * @param  {string} e.utype url的类型(def, ajax, iframe)
     */
    , mainThumbnailShow: function(e) {
        if ('' != e.url) {
          if (e.url.indexOf("http") !== 0) e.url = this.opts.rootUrl + e.url
        }
        if ('iframe' == e.utype) {
          $('#main-block').empty().append($.sprintf(this.opts.tplMainIframe, e.url))
        } else if ('ajax' == e.utype) {
          $('#main-block').ZCThumbnailShow({rootUrl:this.opts.rootUrl}).ZCThumbnailShow('create', e.key, 0, e.url)
        } else {
          $('#main-block').ZCThumbnailShow({rootUrl:this.opts.rootUrl}).ZCThumbnailShow('create', e.key)
        }
      }
  }

  $.fn.ZCMain = function (option) {
    var $this = $(this)
      , data = $this.data('ZCMain')
      , opts = $.extend({}, $.fn.ZCMain.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCMain', (data = new ZCMain(this, opts)))
    if (typeof option == 'string') data[option]()
    return $this
  }

  $.fn.ZCMain.defs = {
      rootUrl       : ''
    , ajaxSearchTip : 'json/searchTip.json'
    , ajaxSearchHot : 'json/searchHot.json'
    , tplSearchTip  : '<li><a href="javascript:void(null)">%s</a></li>'
    , tplSearchHot  : '<li><a href="javascript:void(null)">%s</a></li>'
    , tplMainIframe : '<iframe src="%s"></iframe>'
  }

  $.fn.ZCMain.Constructor = ZCMain

}(window.jQuery);