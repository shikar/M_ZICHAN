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
      }
    , create: function(data) {
      /*
        var key,val
          , list = this.el.find('.sort-bar .list-sort')
        this.data = data
        list.empty()
        for (key in data) {
          val = data[key]
          list.append($.sprintf(this.opts.tplItem, key, val, val))
        }

        list.sortable({
          placeholder : '<li class="placeholder"><a href="#" class="btn btn-default btn-xs disabled" role="button"> 插 入 </a></li>',
          distance    : 3,
          delay       : 100,
          onDrop      : $.proxy(this.onDrop, this)
        })

        this.el.find('.btn-reset').bind('click', $.proxy(this.onResetClick, this))
        list.find('li').bind('click', $.proxy(this.onSortItemClick, this))
        */
      }

    , sortSortList: function() {
        var arr = []
          , ret = []
          , item = null
          , list = this.el.find('.list-sort')
        list.find('li').each(function(idx, el) {
          item = $(el)
          if (item.data('sort') != 'none') {
            arr.push(item)
            ret.push(item.data('key') + ' ' + item.data('sort'))
          }
        })

        list.prepend(arr)
        if (this.prevRet.toString() != ret.toString()) this.el.trigger("onSort", {list:ret})
        this.prevRet = ret
      }
    , onResetClick: function(e) {
        this.create(this.data)
        this.el.trigger("onSort", {list:[]})
      }
    , onSortItemClick: function(e) {
        var self = $(e.currentTarget)
          , sort = self.data('sort')
          , icon = self.find('.glyphpro')
        if (sort == 'none') {
          self.data('sort', 'DESC')
          icon.removeClass(this.opts.iconDef)
              .removeClass('text-muted')
              .addClass(this.opts.iconDesc)
        } else if (sort == 'DESC') {
          self.data('sort', 'ASC')
          icon.removeClass(this.opts.iconDesc)
              .addClass(this.opts.iconAsc)
        } else if (sort == 'ASC') {
          self.data('sort', 'none')
          icon.removeClass(this.opts.iconAsc)
              .addClass(this.opts.iconDef)
              .addClass('text-muted')
        }
        this.sortSortList()
      }
    , onDrop: function($item, position, _super, event) {
        _super($item, position);
        this.sortSortList()
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
      data     : [{"name":"name1", "type":"type1"},{"name":"name2", "type":"type2"}]
    , tplMain  : '<ul class="list-unstyled list-inline filter-bar clearfix"><li class="pull-left">筛选:</li><li class="pull-left"><ul class="list-unstyled list-inline list-filter"></ul></li><li class=" pull-right"><botton type="button" class="btn btn-info btn-xs btn-reset"><span class="glyphpro glyphpro-redo"></span> 重置</botton></li></ul>'
    , tplItem  : '<li data-key="%s" data-sort="none"><a href="javascript:void(null)" class="btn btn-default btn-xs" title="%s">%s <span class="glyphpro glyphpro-sorting text-muted"></span></a></li>'
    , iconDef  : 'glyphpro-sorting'
    , iconAsc  : 'glyphpro-sort_attributes'
    , iconDesc : 'glyphpro-sort_attributes_alt'
  }

  $.fn.ZCFilter.Constructor = ZCFilter

}(window.jQuery);