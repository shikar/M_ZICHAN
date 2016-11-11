!function ($) {

  "use strict"

  var ZCPagination1 = function (el, opts) {
    this.el = el
    this.opts = opts

    this.init()
  }

  ZCPagination1.prototype = {

      constructor: ZCPagination1
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , create: function(data) {
        var i,pagesRange,pagesRangeMin
          , pagesRangeMax = -1
          , $pagination

        this.opts.pageTotal = data.totalPage
        this.opts.pageCur   = data.curPage
        this.opts.count     = data.count

        if (this.opts.pageTotal > 1) {

          pagesRange = parseInt((this.opts.pageRange-1)/2)

          if (this.opts.pageCur-pagesRange < 1) {
            pagesRangeMin = 1
            pagesRangeMax = this.opts.pageRange
          } else
            pagesRangeMin = this.opts.pageCur - pagesRange

          if (pagesRangeMax <= 0) {
            if (this.opts.pageCur+pagesRange > this.opts.pageTotal) {
              pagesRangeMax = this.opts.pageTotal
              pagesRangeMin = this.opts.pageTotal - this.opts.pageRange + 1
            } else
              pagesRangeMax = this.opts.pageCur + pagesRange

          }
          if (pagesRangeMin < 1)
            pagesRangeMin = 1
          else if(pagesRangeMax > this.opts.pageTotal)
            pagesRangeMax = this.opts.pageTotal

          this.el.html(this.opts.tplMain)
          $pagination = this.el.find('nav .pagination')
          $pagination.empty()
          if (this.opts.pageCur == 1)
            $pagination.append($.sprintf(this.opts.tplPagePrev, ' class="disabled"'))
          else
            $pagination.append($.sprintf(this.opts.tplPagePrev, ''))

          for (i = pagesRangeMin; i <= pagesRangeMax; i++) {
            if (this.opts.pageCur == i)
              $pagination.append($.sprintf(this.opts.tplPageItem, ' class="active"', i))
            else
              $pagination.append($.sprintf(this.opts.tplPageItem, '', i))
          }

          if (this.opts.pageCur == this.opts.pageTotal)
            $pagination.append($.sprintf(this.opts.tplPageNext, ' class="disabled"'))
          else
            $pagination.append($.sprintf(this.opts.tplPageNext, ''))
        }
        $pagination.find('li a').bind('click', $.proxy(this.onPageClick, this))
      }

    , onPageClick: function(e) {
        var self = $(e.currentTarget)
          , num = self.text()
        if (num == '«') num = parseInt(this.opts.pageCur)-1
        if (num == '»') num = parseInt(this.opts.pageCur)+1
        this.el.trigger({
          type : "onPage",
          page : num
        })
      }

  }

  $.fn.ZCPagination1 = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCPagination1')
      , opts = $.extend({}, $.fn.ZCPagination1.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCPagination1', (data = new ZCPagination1($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCPagination1.defs = {
      pageRange   : 7
    , pageTotal   : 10
    , pageCur     : 1
    , count       : 9999
    , tplMain     : '<nav aria-label="Page navigation"><ul class="pagination"></ul></nav>'
    , tplPagePrev : '<li%s><a href="javascript:void(null)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'
    , tplPageNext : '<li%s><a href="javascript:void(null)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>'
    , tplPageItem : '<li%s><a href="javascript:void(null)">%s</a></li>'
  }

  $.fn.ZCPagination1.Constructor = ZCPagination1

}(window.jQuery);