!function ($) {

  "use strict"

  var ZCFilter = function (el, opts) {
    this.el = el
    this.opts = opts
    this.selected = []

    this.init()
  }

  ZCFilter.prototype = {

      constructor: ZCFilter
    , init: function() {
        this.el.append(this.opts.tplMain)
        $(window).bind('resize', $.proxy(this.onDocResize, this))
        $('.thumbnail-breadcrumb').find('.ctrl-left, .ctrl-right').bind('click', $.proxy(this.onBreadcrumbCtrlClick, this))
      }
    , create: function(data) {
        var i,j,item,subitem
        for (i = 0; i < data.length; i++) {
          item = data[i]
          this.el.find('.filter-bar').append($.sprintf(this.opts.tplList, item.name))
          for (j = 0; j < item.list.length; j++) {
            subitem = item.list[j]
            this.el.find('.filter-bar dd:last').append($.sprintf(this.opts.tplItem, subitem.id, item.name, subitem.name))
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
    , checkBreadcrumbOver: function() {
        var breadcrumbFilter = $('.thumbnail-breadcrumb>.overflow>ul')
          , overflow = $('.thumbnail-breadcrumb>.overflow')
        if (breadcrumbFilter.width() > overflow.width()) {
          $('.thumbnail-breadcrumb').find('.ctrl-left, .ctrl-right').removeClass('hide')
          $('.thumbnail-breadcrumb').find('.ctrl-right').trigger('click')
        } else {
          $('.thumbnail-breadcrumb').find('.ctrl-left, .ctrl-right').addClass('hide')
        }
      }
    , makeSelectedBtns: function() {
        this.selected = []
        $('.thumbnail-breadcrumb .filter-selects').empty()
        this.el.find('.filter-bar .filter-item.selected').each($.proxy(this.onSelectEach, this))
        $('.thumbnail-breadcrumb .overflow > ul').attr('style', '')
        if ($('.thumbnail-breadcrumb .filter-selects button').length > 0) {
          $('.thumbnail-breadcrumb .filter-selects').removeClass('hide')
          $('.thumbnail-breadcrumb .filter-selects button').bind('click', $.proxy(this.onBreadcrumbFilterClick, this))
        } else {
          $('.thumbnail-breadcrumb .filter-selects').addClass('hide')
        }
        this.el.trigger({
          type     : 'onFilter',
          selected : this.selected
        })
      }
    , onSelectEach: function(idx, el) {
        var $el = $(el)
          , key = $el.data('key')
          , type = $el.data('type')
          , text = $el.text()
          , obj = {}
        $('.thumbnail-breadcrumb .filter-selects').append($.sprintf(this.opts.tplItem, key, type, type+':'+text))
        obj[key] = type
        this.selected.push(obj)
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
        this.checkBreadcrumbOver()
      }
    , onFilterBtnClick: function(e) {
        var self = $(e.currentTarget)
        self.toggleClass(this.opts.clsSeleted)
        this.makeSelectedBtns()

        this.checkBreadcrumbOver()
      }
    , onBreadcrumbCtrlClick: function(e) {
        var self = $(e.currentTarget)
          , ul = $('.thumbnail-breadcrumb .overflow > ul')
          , position = ul.position()
          , overflow = $('.thumbnail-breadcrumb .overflow')
          , left = 0
        if (self.hasClass('ctrl-right')) {
          left = position.left - overflow.width()
        } else {
          left = position.left + overflow.width()
        }
        if (left > 0)
          left = 0
        else if (left < overflow.width()-ul.width())
          left = overflow.width()-ul.width()
        $('.thumbnail-breadcrumb .overflow > ul').css({
          'left': left+'px',
          'position': 'relative'
        })
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
    , tplList    : '<dt>%s:</dt><dd><button type="button" class="btn btn-link btn-xs btn-open pull-right"><span class="glyphicon glyphicon-plus"></span></button></dd>'
    , tplItem    : '<button type="button" class="btn btn-default btn-xs filter-item" data-key="%s" data-type="%s">%s</button> '
    , clsSeleted : 'selected'
    , iconDesc   : 'glyphpro-sort_attributes_alt'
  }

  $.fn.ZCFilter.Constructor = ZCFilter

}(window.jQuery);