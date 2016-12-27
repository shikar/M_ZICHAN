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
        }

        this.el.find('.daterange').daterangepicker({
          "minDate": "YYYY-MM-DD",
          "maxDate": "YYYY-MM-DD",
          "showDropdowns": true
        }).on('apply.daterangepicker', $.proxy(this.onSelected, this))
      }
    , onSelected: function(e, picker) {
        var self = $(e.currentTarget)
          , id = self.attr('id')
        this.ranges[id] = {
          "startDate" : picker.startDate.format('YYYY-MM-DD'),
          "endDate"   : picker.endDate.format('YYYY-MM-DD')
        }
        this.el.trigger({
          type   : "onDateFilter",
          ranges : this.ranges
        })
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
    , tplItem : '<dt class="title" style="margin-top:4px">%s:</dt><dd class="title form-inline"><div class="form-group has-feedback" style="margin-bottom:8px"><input type="text" class="form-control input-sm daterange" style="width:300px" id="%s"><span class="glyphicon glyphicon-calendar form-control-feedback"></span></div></dd>'
  }

  $.fn.ZCDateFilter.Constructor = ZCDateFilter

}(window.jQuery);
