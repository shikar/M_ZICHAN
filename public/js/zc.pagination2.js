!function ($) {

  "use strict"

  var ZCPagination2 = function (el, opts) {
    this.el = el
    this.opts = opts

    this.init()
  }

  ZCPagination2.prototype = {

      constructor: ZCPagination2
    , init: function(data) {
        var $pagination
        this.el.empty()

        if (this.opts.pageTotal > 1) {
          this.el.html(this.opts.tplMain)
          $pagination = this.el.find('nav')
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
        }
        $pagination.find('a').bind('click', $.proxy(this.onPageClick, this))
        $pagination.find('.page-ipt').bind('keypress', $.proxy(this.onPageKeypress, this))
      }

    , onPageClick: function(e) {
        var self = $(e.currentTarget)
          , label = self.attr('aria-label')
          , num = 1
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
        this.el.trigger( "page", [ num ] )
      }
    , onPageKeypress: function(e) {
        var keycode = (e.keyCode ? e.keyCode : e.which)
          , num = parseInt(this.el.find('.page-ipt').val())
        if(keycode == '13'){
          if (num < 1) num = 1
          else if(num > this.opts.pageTotal) num = this.opts.pageTotal
          this.el.trigger( "page", [ num ] )
        }
      }

  }

  $.fn.ZCPagination2 = function () {
    var $this = $(this)
      , option = arguments[0]
      , data = $this.data('ZCPagination2')
      , opts = $.extend({}, $.fn.ZCPagination2.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCPagination2', (data = new ZCPagination2($this, opts)))
    if (typeof option == 'string') data[option]()
  }


  $.fn.ZCPagination2.defs = {
      pageTotal    : 10
    , pageCur      : 1
    , tplMain      : '<nav class="form-inline" aria-label="Page navigation"></nav>'
    , tplPageFrist : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Frist"><span class="glyphicon glyphicon-step-backward"></span></a>'
    , tplPagePrev  : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Prev"><span class="glyphicon glyphicon-triangle-left"></span></a>'
    , tplPageNext  : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Next"><span class="glyphicon glyphicon-triangle-right"></span></a>'
    , tplPageLast  : '<a href="javascript:void(null)" class="btn btn-link%s" aria-label="Last"><span class="glyphicon glyphicon-step-forward"></span></a>'
    , tplPageItem  : '<input class="form-control page-ipt" type="text" value="%s"> / <span class="page-max">%s</span>'
  }

  $.fn.ZCPagination2.Constructor = ZCPagination2

}(window.jQuery);