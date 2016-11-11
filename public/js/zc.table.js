!function ($) {

  "use strict"

  var ZCTable = function (el, opts) {
    this.el = el
    this.opts = opts
    this.urlPath = ''
    this.ajaxData = null

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCTable.prototype = {

      constructor: ZCTable
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , create: function(data) {
        var i,j,item
        this.data = data
        this.el.find('thead').empty()
        this.el.find('tbody').empty()
        this.el.find('thead').append('<tr></tr>')
        if (this.data.info.checkbox == true) this.el.find('thead tr').append('<th class="text-center">#</th>')
        for (i = 0; i < data.fields.length; i++) {
          if (!data.fields[i]['hidden']) this.el.find('thead tr').append('<th>'+data.fields[i]['name']+'</th>')
        }
        this.el.find('thead tr').append('<th class="text-center">操作</th>')

        for (i = 0; i < data.lists.length; i++) {
          item = data.lists[i]
          this.el.find('tbody').append($.sprintf('<tr data-key="%s"></tr>', item[0]))
          if (this.data.info.checkbox == true) {
            this.el.find('tbody tr:last').append('<td class="text-center"><input type="checkbox" name="ids[]" value="'+item[0]+'"></td>')
          }
          for (j = 0; j < item.length; j++) {
            if (!data.fields[j]['hidden'])
              this.el.find('tbody tr:last').append('<td>'+this.checkKeyword(item[j])+'</td>')
          }
          this.el.find('tbody tr:last').append('<td class="text-center act-btn">'+this.opts.tplActBtns+'</td>')
        }

        this.el.find('tbody .act-btn a').bind('click', $.proxy(this.onBtnActClick, this))
        this.el.find('tbody tr').bind('click', $.proxy(this.onTrClick, this))
      }
    , checkKeyword: function(str) {
        str = str + ''
        str = str.replace(new RegExp('('+this.data.info.keyword+')', 'ig'), '<b class="'+this.opts.clsKeyword+'">$1</b>')
        return str
      }
    , onBtnActClick: function(e) {
        var self = $(e.currentTarget)
          , key = self.parents('tr').data('key')
          , idx = self.index()
        this.el.trigger({
          type : 'onAct',
          key  : key,
          idx  : idx
        })
      }
    , onTrClick: function(e) {
        var self = $(e.currentTarget)
        if (this.data.info.checkbox == false)
          this.el.find('tbody tr').removeClass(this.opts.clsSelected)
        self.toggleClass(this.opts.clsSelected)
        if (self.hasClass(this.opts.clsSelected))
          self.find('input[type=checkbox]').prop('checked',true)
        else
          self.find('input[type=checkbox]').prop('checked',false)
      }
  }

  $.fn.ZCTable = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCTable')
      , opts = $.extend({}, $.fn.ZCTable.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCTable', (data = new ZCTable($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
    return $this
  }

  $.fn.ZCTable.defs = {
      data        : null
    , loadHtml    : '<div class="sk-wave"><div class="sk-rect sk-rect1"></div><div class="sk-rect sk-rect2"></div><div class="sk-rect sk-rect3"></div><div class="sk-rect sk-rect4"></div><div class="sk-rect sk-rect5"></div></div>'
    , tplMain     : '<table class="table table-striped table-hover"><thead></thead><tbody></tbody></table>'
    , tplActBtns  : '<a href="javascript:void(null)"><span class="glyphicon glyphicon-heart"></span></a> <a href="javascript:void(null)"><span class="glyphicon glyphicon-edit"></span></a>'
    , clsKeyword  : 'red'
    , clsSelected : 'info'
  }

  $.fn.ZCTable.Constructor = ZCTable

}(window.jQuery);