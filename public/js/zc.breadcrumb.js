!function ($) {

  "use strict"

  var ZCBreadcrumb = function (el, opts) {
    this.opts = opts
    this.el = el

    this.init()
  }

  ZCBreadcrumb.prototype = {

      constructor: ZCBreadcrumb
    , init: function() {
        this.el.prepend(this.opts.tplMain)
        this.el.find('input[name=search]').bind('keypress', $.proxy(this.onKeyEnter, this))
        this.el.find('.btn-search').bind('click', $.proxy(this.onSearchClick, this))
      }
    , create: function(data) {
        var i,item,link
        this.el.find('.thumbnail-breadcrumb ul').empty()
        this.el.find('input[name=search]').attr('placeholder', data.serchplaceholder)
        if (data.searchcontent)
            this.el.find('input[name=search]').val(data.searchcontent)
        for (i = 0; i < data.list.length; i++) {
          item = data.list[i]
          link = item.name
          if (item.url)
            link = $.sprintf(this.opts.tplLink, item.url, item.type, link)
          this.el.find('.thumbnail-breadcrumb ul').append($.sprintf(this.opts.tplItem, link))
        }
        this.el.find('.thumbnail-breadcrumb ul').append(this.opts.tplSelect)

        this.el.find('.thumbnail-breadcrumb ul .item-link').bind('click', $.proxy(this.onLinkClick, this))
      }
    , onSearchClick: function(e) {
        var self = $(e.currentTarget)
          , search = this.el.find('input[name=search]').val()
        //if (search == '') return
        this.el.trigger({
          type   : 'onSearch',
          search : search
        })
      }
    , onKeyEnter: function(e) {
        var key = e.which;
        if (key == 13)
          this.el.find('.btn-search').trigger('click')
      }
    , onLinkClick: function(e) {
        var self = $(e.currentTarget)
          , url  = self.attr('href')
          , type = self.data('type')

        e.stopPropagation()
        if (type == 'open') return true

        this.el.trigger({
          type    : 'onAct',
          cmd     : 'link',
          utype   : type,
          murlnum : 4,
          url     : url
        })
        return false
      }
  }

  $.fn.ZCBreadcrumb = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCBreadcrumb')
      , opts = $.extend({}, $.fn.ZCBreadcrumb.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCBreadcrumb', (data = new ZCBreadcrumb($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCBreadcrumb.defs = {
      tplMain   : '<div class="thumbnail-breadcrumb clearfix"><a href="javascript:void(null)" class="ctrl-left hide"><span class="glyphicon glyphicon-chevron-left"></span></a><a href="javascript:void(null)" class="ctrl-right hide"><span class="glyphicon glyphicon-chevron-right"></span></a><div class="overflow"><ul class="list-unstyled"></ul></div><div class="form-inline"><div class="input-group input-group-sm" style="width:300px;"><input type="text" name="search" class="form-control" placeholder="搜索当前目录下"><span class="input-group-btn" style="width: 1%;"><button class="btn btn-default btn-search" type="button"><span class="glyphicon glyphicon-search"></span></button></span></div></div></div>'
    , tplItem   : '<li>%s</li>'
    , tplSelect : '<li class="filter-selects hide"></li>'
    , tplLink   : '<a href="%s" class="item-link" data-type="%s">%s</a>'
  }

  $.fn.ZCBreadcrumb.Constructor = ZCBreadcrumb

}(window.jQuery);