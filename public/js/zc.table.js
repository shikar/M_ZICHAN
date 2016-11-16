!function ($) {

  "use strict"

  var ZCTable = function (el, opts) {
    this.el = el
    this.opts = opts
    this.ajaxData = null

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
        this.el.find('.table-btn').detach()
        this.el.find('thead').empty()
        this.el.find('tbody').empty()
        this.el.find('thead').append('<tr></tr>')
        if (this.data.info.checkbox == true) this.el.find('thead tr').append('<th class="text-center"><input type="checkbox" name="seletct-all"></th>')
        for (i = 0; i < data.fields.length; i++) {
          if (!data.fields[i]['hidden']) this.el.find('thead tr').append('<th>'+data.fields[i]['name']+'</th>')
        }
        if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0) this.el.find('thead tr').append('<th class="text-center">操作</th>')

        for (i = 0; i < data.lists.length; i++) {
          item = data.lists[i]
          this.el.find('tbody').append($.sprintf('<tr data-key="%s"></tr>', item[0]))
          if (this.data.info.checkbox == true) {
            this.el.find('tbody tr:last').append('<td class="text-center"><input type="checkbox" name="ids" value="'+item[0]+'"></td>')
          }
          for (j = 0; j < item.length; j++) {
            if (!data.fields[j]['hidden'])
              this.el.find('tbody tr:last').append('<td>'+this.checkKeyword(item[j])+'</td>')
          }
          if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0) {
            this.el.find('tbody tr:last').append('<td class="text-center act-btn"></td>')
            for (j = 0; j < data.info.listbtn.length; j++) {
              this.el.find('tbody tr:last .act-btn').append(data.info.listbtn[j])
            }
          }

        }

        if (data.info.hasOwnProperty('tablebtn') && data.info.tablebtn.length > 0) {
          this.el.append(this.opts.tplTblBtns)
          for (i = 0; i < data.info.tablebtn.length; i++) {
            this.el.find('.table-btn').append(data.info.tablebtn[i]+' ')
          }
          this.el.find('input[name=seletct-all]').bind('click', $.proxy(this.onSelectAllClick, this))
          this.el.find('.table-btn a').tooltip().bind('click', $.proxy(this.onTableBtnActClick, this))
        }


        if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0) this.el.find('tbody .act-btn a').tooltip().bind('click', $.proxy(this.onListBtnActClick, this))

        this.el.find('tbody tr').bind('click', $.proxy(this.onTrClick, this))
      }
    , checkKeyword: function(str) {
        str = str + ''
        str = str.replace(new RegExp('('+this.data.info.keyword+')', 'ig'), '<b class="'+this.opts.clsKeyword+'">$1</b>')
        return str
      }
    , onSelectAllClick: function(e) {
        var self = $(e.currentTarget)
          , cheched = self.prop('checked')
        this.el.find('tbody tr input[type=checkbox]').prop('checked', cheched)
        if (cheched)
          this.el.find('tbody tr').addClass(this.opts.clsSelected)
        else
          this.el.find('tbody tr').removeClass(this.opts.clsSelected)
      }
    , onTableBtnActClick: function(e) {
        var self = $(e.currentTarget)
          , idx = self.index()
          , key = []
        this.el.find('tbody tr input[name=ids]:checked').each(function(idx, el) {
          var $el = $(el)
          key.push($el.val())
        })
        this.el.trigger({
          type : 'onAct',
          cmd  : 'table',
          key  : key,
          idx  : idx
        })
      }
    , onListBtnActClick: function(e) {
        var self = $(e.currentTarget)
          , key = self.parents('tr').data('key')
          , idx = self.index()
        this.el.trigger({
          type : 'onAct',
          cmd  : 'list',
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
    , tplMain     : '<table class="table table-striped table-hover table-list"><thead></thead><tbody></tbody></table>'
    , tplTblBtns  : '<div class="table-btn text-center"></div>'
    , clsKeyword  : 'red'
    , clsSelected : 'info'
  }

  $.fn.ZCTable.Constructor = ZCTable

}(window.jQuery);