!function ($) {

  "use strict"

  var ZCDateFilter = function (el, opts) {
    this.el = el
    this.opts = opts
    this.ranges = {}

    this.init()
  }

  ZCDateFilter.prototype = {

      constructor: ZCDateFilter
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , clear: function() {
        this.el.find('.datefilter-bar').empty()
        this.ranges = {}
      }
    , create: function(data) {
        this.clear()
        var i,item = null
        if (data.length > 0) {
          for (i = 0; i < data.length; i++) {
            item = data[i]
            this.el.find('.datefilter-bar').append($.sprintf(this.opts.tplItem, item.name, item.key))
          }
          this.el.find('.datefilter-bar').append(this.opts.tplBtn)
          this.el.find('.datepicker').datepicker({
            format: "yyyy-mm-dd",
            orientation: "bottom auto",
            clearBtn: true,
            todayHighlight: true,
            autoclose: true
          })
          this.el.find('.btn-submit').bind('click', $.proxy(this.onSubmit, this));
        }
      }
    , onSubmit: function(e) {
        this.ranges = {}
        this.el.find('.datepicker').each($.proxy(this.eachItem, this))
        this.el.trigger({
          type   : "onDateFilter",
          ranges : this.ranges
        })
      }
    , eachItem: function(ind, el) {
        var cur = $(el)
          , id = cur.attr('id')
          , start = cur.find('input[name=start]').val()
          , end = cur.find('input[name=end]').val()
        if (start != '' && end != '') {
          this.ranges[id] = {
            "startDate" : start,
            "endDate"   : end
          }
        }
      }
  }

  $.fn.ZCDateFilter = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCDateFilter')
      , opts = $.extend({}, $.fn.ZCDateFilter.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCDateFilter', (data = new ZCDateFilter($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCDateFilter.defs = {
      data    : true
    , tplMain : '<dl class="dl-horizontal datefilter-bar clearfix"></dl>'
    , tplItem : '<dt class="title" style="margin-top:4px">%s:</dt><dd class="title form-inline"><div class="input-daterange input-group datepicker" id="%s" style="margin-bottom:4px;width:400px"><input type="text" class="input-sm form-control" name="start" /><span class="input-group-addon">-</span><input type="text" class="input-sm form-control" name="end" /></div></dd>'
    , tplBtn  : '<dt class="title" style="margin-top:4px"> </dt><dd class="title" style="margin-top:4px;margin-bottom:4px"><button class="btn btn-success btn-sm btn-submit">筛选</button></dd>'
  }

  $.fn.ZCDateFilter.Constructor = ZCDateFilter

}(window.jQuery);
