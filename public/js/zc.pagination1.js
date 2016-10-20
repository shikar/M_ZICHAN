!function ($) {

  "use strict"

  var ZCPagination1 = function (el, opts) {
    this.el = el
    this.opts = opts

    this.init()
  }

  ZCPagination1.prototype = {

      constructor: ZCPagination1
    , init: function(data) {
        var i,pagesRange,pagesRangeMin
          , pagesRangeMax = -1
          , $pagination
        this.el.empty()

        if (this.opts.pageTotal > 1) {

          pagesRange = parseInt((this.opts.pageNum-1)/2)

          if (this.opts.pageCur-pagesRange < 1) {
            pagesRangeMin = 1
            pagesRangeMax = this.opts.pageNum
          } else {
            pagesRangeMin = this.opts.pageCur-pagesRange
          }
          if (pagesRangeMax <= 0) {
            if (this.opts.pageCur+pagesRange > this.opts.pageTotal) {
              pagesRangeMax = this.opts.pageTotal
              pagesRangeMin = this.opts.pageTotal - this.opts.pageNum + 1
            } else {
              pagesRangeMax = this.opts.pageCur+pagesRange
            }
          }

          this.el.html(this.opts.tplMain)
          $pagination = this.el.find('.pagination')
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
        this.el.trigger( "page", [ num ] )
      }

  }

  $.fn.ZCPagination1 = function () {
    var $this = $(this)
      , option = arguments[0]
      , data = $this.data('ZCPagination1')
      , opts = $.extend({}, $.fn.ZCPagination1.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCPagination1', (data = new ZCPagination1($this, opts)))
    if (typeof option == 'string') data[option]()
  }

  $.fn.ZCPagination1.defs = {
      tplMain: '<nav aria-label="Page navigation"><ul class="pagination"></ul></nav>'
    , pageNum: 7
    , pageTotal: 10
    , pageCur: 1
    , tplPagePrev: '<li%s><a href="javascript:void(null)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>'
    , tplPageNext: '<li%s><a href="javascript:void(null)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>'
    , tplPageItem: '<li%s><a href="javascript:void(null)">%s</a></li>'
  }

  $.fn.ZCPagination1.Constructor = ZCPagination1

}(window.jQuery);