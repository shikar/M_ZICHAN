!function ($) {

  "use strict"

  var ZCDateFilter = function (el, opts) {
    this.el = el
    this.opts = opts
    this.prevRet = []

    this.init()
  }

  ZCDateFilter.prototype = {

      constructor: ZCDateFilter
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , clear: function() {
        // this.el.find('.datefilter-bar').empty()
      }
    , create: function(data) {
        this.el.find('.datefilter-bar').append(this.opts.tplItem)
        this.el.find('#daterange').daterangepicker({
          "minDate": "YYYY-MM-DD",
          "maxDate": "YYYY-MM-DD"
        }, $.proxy(this.onSelected, this))
      }
    , onSelected: function(start, end, label) {
        this.el.trigger({
          type : "onDateFilter",
          sDate : start.format('YYYY-MM-DD'),
          eDate : end.format('YYYY-MM-DD'),
        })
        // console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'))
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
    , tplItem : '<dt class="title" style="margin-top:4px">提交时间:</dt><dd class="title form-inline"><div class="form-group has-feedback" style="margin-bottom:8px"><input type="text" class="form-control input-sm" style="width:300px" id="daterange" placeholder="请选择日期区间"><span class="glyphicon glyphicon-calendar form-control-feedback"></span></div></dd>'
  }

  $.fn.ZCDateFilter.Constructor = ZCDateFilter

}(window.jQuery);
