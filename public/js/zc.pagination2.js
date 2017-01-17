!function ($) {

  "use strict"

  var ZCPagination2 = function (el, opts) {
    this.el = el
    this.opts = opts

    this.init()
  }

  ZCPagination2.prototype = {

      constructor: ZCPagination2
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , clear: function() {
        this.el.find('nav').empty()
        this.el.find('nav').hide()
      }
    , create: function(data) {
        var $pagination

        this.opts.pageTotal = data.totalPage
        this.opts.pageCur   = data.curPage
        this.opts.count     = data.count

        this.clear()
        $pagination = this.el.find('nav')

        $pagination.append(this.opts.tplPagePerCount)

        if ($.cookie('page-per-count') != undefined) {
          $pagination.find('.page-per-count option[value='+$.cookie('page-per-count')+']').attr('selected', 'selected')
        }
        if (this.opts.pageTotal > 1) {
          if (this.opts.pageCur == 1) {
            $pagination.append($.sprintf(this.opts.tplPageFrist, ' disabled'))
            $pagination.append($.sprintf(this.opts.tplPagePrev, ' disabled'))
          } else {
            $pagination.append($.sprintf(this.opts.tplPageFrist, ''))
            $pagination.append($.sprintf(this.opts.tplPagePrev, ''))
          }

          $pagination.append($.sprintf(this.opts.tplPageItem, this.opts.pageCur, this.opts.pageTotal))

          if (this.opts.pageCur == this.opts.pageTotal) {
            $pagination.append($.sprintf(this.opts.tplPageNext, ' disabled'))
            $pagination.append($.sprintf(this.opts.tplPageLast, ' disabled'))
          } else {
            $pagination.append($.sprintf(this.opts.tplPageNext, ''))
            $pagination.append($.sprintf(this.opts.tplPageLast, ''))
          }

          $pagination.append($.sprintf(this.opts.tplPageTotal, this.opts.count))
        }
        $pagination.find('a').bind('click', $.proxy(this.onPageClick, this))
        $pagination.find('.page-ipt').bind('keypress', $.proxy(this.onPageKeypress, this))
        $pagination.find('.page-per-count').bind('change', $.proxy(this.onPagePerCountChange, this))

        this.el.find('nav').show()
      }

    , onPageClick: function(e) {
        var self = $(e.currentTarget)
          , label = self.attr('aria-label')
          , num = 1
          , per = parseInt(this.el.find('.page-per-count option:selected').val())
        switch (label) {
          case 'Frist':
            num = 1;
            break;
          case 'Prev':
            num = parseInt(this.opts.pageCur)-1;
            break;
          case 'Next':
            num = parseInt(this.opts.pageCur)+1;
            break;
          case 'Last':
            num = this.opts.pageTotal;
            break;
        }
        this.el.trigger({
          type : "onPage",
          page : num,
          per  : per

        })
      }
    , onPageKeypress: function(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which)
          , num = parseInt(this.el.find('.page-ipt').val())
          , per = parseInt(this.el.find('.page-per-count option:selected').val())
        if(keycode == '13'){
          if (num < 1) num = 1
          else if(num > this.opts.pageTotal) num = this.opts.pageTotal
          this.el.trigger({
            type : "onPage",
            page : num,
            per  : per
          })
        }
      }
    , onPagePerCountChange: function(e) {
        var num = parseInt(this.el.find('.page-ipt').val())
          , per = parseInt(this.el.find('.page-per-count option:selected').val())
        if (per > 0) $.cookie('page-per-count', per, { expires: 7*24*60*60, path: '/' })
        this.el.trigger({
          type : "onPage",
          page : num,
          per  : per
        })
      }

  }

  $.fn.ZCPagination2 = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCPagination2')
      , opts = $.extend({}, $.fn.ZCPagination2.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCPagination2', (data = new ZCPagination2($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }


  $.fn.ZCPagination2.defs = {
      pageTotal       : 10
    , pageCur         : 1
    , count           : 9999
    , tplMain         : '<div class="text-center"><nav class="form-inline" aria-label="Page navigation"></nav></div>'
    , tplPageFrist    : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Frist"><span class="glyphicon glyphicon-step-backward"></span></a>'
    , tplPagePrev     : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Prev"><span class="glyphicon glyphicon-triangle-left"></span></a>'
    , tplPageNext     : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Next"><span class="glyphicon glyphicon-triangle-right"></span></a>'
    , tplPageLast     : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Last"><span class="glyphicon glyphicon-step-forward"></span></a>'
    , tplPagePerCount : '每页显示 <select class="form-control page-per-count"><option value="20">20</option><option value="50">50</option><option value="100">100</option></select> '
    , tplPageItem     : '<input class="form-control page-ipt" type="text" value="%s"> / <span class="page-max">%s</span>'
    , tplPageTotal    : '共有 <b>%s</b> 条记录'
  }

  $.fn.ZCPagination2.Constructor = ZCPagination2

}(window.jQuery);
