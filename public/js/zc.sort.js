!function ($) {

  "use strict"

  var ZCSort = function (el, opts) {
    this.el = el
    this.opts = opts
    this.prevRet = []

    this.init()
  }

  ZCSort.prototype = {

      constructor: ZCSort
    , init: function() {
        this.el.append(this.opts.tplMain)
        this.el.find('[data-toggle=tooltip]').tooltip()
      }
    , create: function(data) {
        var key,val
          , list = this.el.find('.sort-bar .list-sort')
        this.data = data

        list.empty()
        for (key in data) {
          val = data[key]
          list.append($.sprintf(this.opts.tplItem, val.name, val.value, val.value))
        }

        list.sortable({
          placeholder : '<li class="placeholder"><a href="#" class="btn btn-default btn-xs disabled" role="button"> 插 入 </a></li>',
          distance    : 3,
          delay       : 100,
          onDrop      : $.proxy(this.onDrop, this)
        })

        this.el.find('.btn-reset').bind('click', $.proxy(this.onResetClick, this))
        list.find('li').bind('click', $.proxy(this.onSortItemClick, this))
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
        if (this.prevRet.toString() != ret.toString())
          this.el.trigger({
          type : "onSort",
          list : ret
        })
        this.prevRet = ret
      }
    , onResetClick: function(e) {
        this.create(this.data)
        this.el.trigger({
          type : "onSort",
          list : []
        })
      }
    , onSortItemClick: function(e) {
        var self = $(e.currentTarget)
          , btn = self.find('.btn')
          , sort = self.data('sort')
          , icon = self.find('.glyphpro')
        if (sort == 'none') {
          self.data('sort', 'DESC')
          btn.addClass('selected')
          icon.removeClass(this.opts.iconDef)
              .removeClass('text-muted')
              .addClass(this.opts.iconDesc)
        } else if (sort == 'DESC') {
          self.data('sort', 'ASC')
          btn.addClass('selected')
          icon.removeClass(this.opts.iconDesc)
              .addClass(this.opts.iconAsc)
        } else if (sort == 'ASC') {
          self.data('sort', 'none')
          btn.removeClass('selected')
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

  $.fn.ZCSort = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCSort')
      , opts = $.extend({}, $.fn.ZCSort.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCSort', (data = new ZCSort($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCSort.defs = {
      data     : [{"name":"name1", "type":"type1"},{"name":"name2", "type":"type2"}]
    , tplMain  : '<dl class="dl-horizontal sort-bar clearfix" data-toggle="tooltip" data-placement="top" title="点击更换升降序,拖动变换次序"><dt class="title">排序:</dt><dd class="title"><botton type="button" class="btn btn-default btn-xs btn-reset pull-right"><span class="glyphpro glyphpro-redo"></span> 重置</botton><ul class="list-unstyled list-inline list-sort"></ul></dd></dl>'
    , tplItem  : '<li data-key="%s" data-sort="none"><a href="javascript:void(null)" class="btn btn-default btn-xs" title="%s">%s <span class="glyphpro glyphpro-sorting text-muted"></span></a></li>'
    , iconDef  : 'glyphpro-sorting'
    , iconAsc  : 'glyphpro-arrow_down'
    , iconDesc : 'glyphpro-arrow_up'
  }

  $.fn.ZCSort.Constructor = ZCSort

}(window.jQuery);