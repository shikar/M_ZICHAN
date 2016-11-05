!function ($) {

  "use strict"

  var ZCSort = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCSort.prototype = {

      constructor: ZCSort
    , init: function() {
        this.el.append(this.opts.tplMain)
        this.el.find('[data-toggle=tooltip]').tooltip()
      }
    , create: function(data) {
        var i,item
          , list = this.el.find('.list-sort')
        this.data = data
        list.empty()
        for (i = 0; i < data.length; i++) {
          item = data[i]
          list.append($.sprintf(this.opts.tplItem, item.type, item.name, item.name))
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
            ret.push({
              type : item.data('type'),
              sort : item.data('sort')
            })
          }
        })
        list.prepend(arr)
        if (ret.length > 0) this.el.trigger("onSort", {list:ret})
      }
    , onResetClick: function(e) {
        this.create(this.data)
      }
    , onSortItemClick: function(e) {
        var self = $(e.currentTarget)
          , sort = self.data('sort')
          , icon = self.find('.glyphpro')
        if (sort == 'none') {
          self.data('sort', 'desc')
          icon.removeClass(this.opts.iconDef)
              .removeClass('text-muted')
              .addClass(this.opts.iconDesc)
        } else if (sort == 'desc') {
          self.data('sort', 'asc')
          icon.removeClass(this.opts.iconDesc)
              .addClass(this.opts.iconAsc)
        } else if (sort == 'asc') {
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
    , tplMain  : '<ul class="list-unstyled list-inline sort-bar clearfix" data-toggle="tooltip" data-placement="top" title="点击更换升降序,拖动变换次序"><li class="pull-left">排序:</li><li class="pull-left"><ul class="list-unstyled list-inline list-sort"></ul></li><li class=" pull-right"><botton type="button" class="btn btn-info btn-xs btn-reset"><span class="glyphpro glyphpro-redo"></span> 重置</botton></li></ul>'
    , tplItem  : '<li data-type="%s" data-sort="none"><a href="javascript:void(null)" class="btn btn-default btn-xs" title="%s">%s <span class="glyphpro glyphpro-sorting text-muted"></span></a></li>'
    , iconDef  : 'glyphpro-sorting'
    , iconAsc  : 'glyphpro-sort_attributes'
    , iconDesc : 'glyphpro-sort_attributes_alt'
  }

  $.fn.ZCSort.Constructor = ZCSort

}(window.jQuery);