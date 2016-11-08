!function ($) {

  "use strict"

  var ZCFilter = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''
    this.prevRet = []

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCFilter.prototype = {

      constructor: ZCFilter
    , init: function() {
        this.el.append(this.opts.tplMain)
        $(window).bind('resize', $.proxy(this.onDocResize, this))
      }
    , create: function(data) {
        var i,j
        for (i = 0; i < 4; i++) {
          this.el.find('.filter-bar').append($.sprintf(this.opts.tplList, '类别'+i))
          for (j = 0; j < 12; j++) {
            this.el.find('.filter-bar dd:last').append($.sprintf(this.opts.tplItem, j, '类别'+i, '类别_子类'+j))
          }
        }
        this.el.find('.filter-bar .btn-open').bind('click', $.proxy(this.onOpenClick, this))
        this.el.find('.filter-bar .filter-item').bind('click', $.proxy(this.onFilterBtnClick, this))
        this.checkOpenBtn()
      }
    , checkOpenBtn: function() {
        this.el.find('.filter-bar dd').each(function(idx, el){
          var $el = $(el)
          $el.attr('style', '').find('.btn-open').hide()
          if ($el.height() > 30) {
            $el.css({'height':'30px','overflow':'hidden'}).find('.btn-open').show()
          }
        })
      }
    , makeSelectedBtns: function() {
        $('.thumbnail-breadcrumb .filter-selects').empty()
        this.el.find('.filter-bar .filter-item.selected').each($.proxy(this.onSelectEach, this))
        if ($('.thumbnail-breadcrumb .filter-selects button').length > 0) {
          $('.thumbnail-breadcrumb .filter-selects').removeClass('hide')
          $('.thumbnail-breadcrumb .filter-selects button').bind('click', $.proxy(this.onBreadcrumbFilterClick, this))
        } else {
          $('.thumbnail-breadcrumb .filter-selects').addClass('hide')
        }
      }
    , onSelectEach: function(idx, el, e) {
        var $el = $(el)
          , key = $el.data('key')
          , type = $el.data('type')
          , text = $el.text()
        $('.thumbnail-breadcrumb .filter-selects').append($.sprintf(this.opts.tplItem, key, type, type+':'+text))
      }
    , onBreadcrumbFilterClick: function(e) {
        var self = $(e.currentTarget)
          , key = self.data('key')
          , type = self.data('type')
        this.el.find('.filter-bar .filter-item.selected[data-key="'+key+'"][data-type="'+type+'"]').trigger('click')
      }

    , onOpenClick: function(e) {
        var self = $(e.currentTarget)
          , dd = self.parents('dd')
          , icon = self.find('.glyphicon')
        if (icon.hasClass('glyphicon-plus')) {
          dd.attr('style', '')
          icon.removeClass('glyphicon-plus').addClass('glyphicon-minus')
        } else {
          dd.css({'height':'30px','overflow':'hidden'})
          icon.removeClass('glyphicon-minus').addClass('glyphicon-plus')
        }

      }
    , onDocResize: function(e) {
        this.checkOpenBtn()
      }
    , onFilterBtnClick: function(e) {
        var self = $(e.currentTarget)
        self.toggleClass(this.opts.clsSeleted)
        this.makeSelectedBtns()
      }
  }

  $.fn.ZCFilter = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCFilter')
      , opts = $.extend({}, $.fn.ZCFilter.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCFilter', (data = new ZCFilter($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCFilter.defs = {
      data       : [{"name":"name1", "type":"type1"},{"name":"name2", "type":"type2"}]
    , tplMain    : '<dl class="dl-horizontal filter-bar clearfix"></dl>'
    , tplList    : '<dt>%s</dt><dd><button type="button" class="btn btn-default btn-xs btn-open pull-right"><span class="glyphicon glyphicon-plus"></span></button></dd>'
    , tplItem    : '<button type="button" class="btn btn-default btn-xs filter-item" data-key="%s" data-type="%s">%s</button> '
    , clsSeleted : 'selected'
    , iconDesc   : 'glyphpro-sort_attributes_alt'
  }

  $.fn.ZCFilter.Constructor = ZCFilter

}(window.jQuery);