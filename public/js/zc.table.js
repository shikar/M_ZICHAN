!function ($) {

  "use strict"

  var ZCTable = function (el, opts) {
    this.el = el
    this.opts = opts
    this.data = null
    this.list = null

    this.init()
  }

  ZCTable.prototype = {

      constructor: ZCTable
    , init: function() {
        this.el.append(this.opts.tplMain)
      }
    , create: function(data) {
        var i,j,item,$lastTr,td,itemLinkRet
        this.data = data
        this.el.find('thead').empty()
        this.el.find('thead').append('<tr></tr>')

        // 是否生成 checkbox 头
        if (this.data.info.checkbox == true) this.el.find('thead tr').append('<th class="text-center"><input type="checkbox" name="seletct-all"></th>')
        for (i = 0; i < data.fields.length; i++) {
          if (!data.fields[i]['hidden']) this.el.find('thead tr').append('<th>'+data.fields[i]['name']+'</th>')
        }
        if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0) this.el.find('thead tr').append('<th class="text-center">操作</th>')

        //if(data.lists!=null  && data.lists.length>0){
          this.formatData(data)
          this.el.find('tbody').empty()
          for (i = 0; i < this.list.length; i++) {
            item = this.list[i]
            this.el.find('tbody').append($.sprintf('<tr data-key="%s"></tr>', item.id.value))
            $lastTr = this.el.find('tbody tr:last')

            // 是否生成 checkbox
            if (this.data.info.checkbox == true) {
              $lastTr.append('<td class="text-center"><input type="checkbox" name="ids" value="'+item.id.value+'"></td>')
            }

            // 插入表格内数据
            for (j in item) {
              if (item[j]['hidden']) continue
              td = item[j]['value']
              if (!data.info.keyfields || $.inArray(item[j].name, data.info.keyfields) != -1)
                td = this.checkKeyword(td)

              if (item[j].hasOwnProperty('link') && item[j].link!=null) {
                itemLinkRet = this.checkLink(item[j], item)
                if (item[j].hasOwnProperty('type'))
                  td = $.sprintf(this.opts.tplLink, itemLinkRet, item[j].type, item[j].menu, td)
              }
              $lastTr.append('<td>'+td+'</td>')
            }

            // 插入记录按钮
            if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0) {
              this.el.find('tbody tr:last').append('<td class="text-center act-btn"></td>')
              for (j = 0; j < data.info.listbtn.length; j++) {
                $lastTr.find('.act-btn').append(this.checkAct(data.info.listbtn[j], item))
              }
            }
          }
        //}



        this.el.find('.table-btn').empty()
        // 插入表格按钮和事件
        if (data.info.hasOwnProperty('tablebtn') && data.info.tablebtn.length > 0) {
          for (i = 0; i < data.info.tablebtn.length; i++) {
            this.el.find('.table-btn').append(data.info.tablebtn[i]+' ')
          }
          this.el.find('input[name=seletct-all]').bind('click', $.proxy(this.onSelectAllClick, this))
          this.el.find('.table-btn a').tooltip().bind('click', $.proxy(this.onTableBtnActClick, this))
        }

        // 插入记录按钮事件
        if (data.info.hasOwnProperty('listbtn') && data.info.listbtn.length > 0)
          this.el.find('tbody .act-btn a').tooltip().bind('click', $.proxy(this.onListBtnActClick, this))

        this.el.find('tbody tr').bind('click', $.proxy(this.onTrClick, this))
        this.el.find('tbody tr .item-link').bind('click', $.proxy(this.onLinkClick, this))
      }
    , formatData: function(data) {
        var i,j,row
        this.list = []
        if(data.lists!=null){
          for (i = 0; i < data.lists.length; i++) {
            row = {}
            for (j = 0; j < data.lists[i].length; j++) {
            row[data.fields[j]['name']] = jQuery.extend({'value':data.lists[i][j]==null?"":data.lists[i][j]}, data.fields[j])
            }
            this.list.push(row)
          }
        }
      }
    , checkLink: function(cur, row) {
        var i,re
          , hash = window.location.hash
          , ret = cur.link
        for (i in row)
          ret = ret.replace(new RegExp(':'+i, 'g'), row[i].value)
        if (hash.indexOf('#m') === 0)
          ret = ret.replace(/:murl/g, hash.replace('#', ''))
        return ret
      }
    , checkAct: function(link, row) {
        var i
          , hash = window.location.hash
        for (i in row)
          link = link.replace(new RegExp(':'+i, 'g'), row[i].value)
        if (hash.indexOf('#m') === 0)
          link = link.replace(/:murl/g, hash.replace('#', ''))
        return link
      }
    , checkKeyword: function(str) {
        str = str.toString()
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
          , url  = self.attr('href')
          , type = self.data('type')
          , key  = []
        this.el.find('tbody tr input[name=ids]:checked').each(function(idx, el) {
          var $el = $(el)
          key.push($el.val())
        })

        if (key.length <= 0) return false

        url = this.checkAct(url, {"ids":{"value":key.toString()}})
        self.attr('href', url)
        if (type == 'open') return true

        this.el.trigger({
          type  : 'onAct',
          cmd   : 'table',
          utype : type,
          url   : url
        })
        return false
      }
    , onListBtnActClick: function(e) {
        var self = $(e.currentTarget)
          , url  = self.attr('href')
          , type = self.data('type')

        e.stopPropagation()
        if (type == 'open') return true

        this.el.trigger({
          type  : 'onAct',
          cmd   : 'list',
          utype : type,
          url   : url
        })

        return false
      }
    , onLinkClick: function(e) {
        var self = $(e.currentTarget)
          , menu = self.data('menu')
          , url  = self.attr('href')
          , type = self.data('type')

        e.stopPropagation()
        if (type == 'open') return true

        this.el.trigger({
          type  : 'onAct',
          cmd   : 'link',
          utype : type,
          url   : url
        })
        return false
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
    , tplMain     : '<table class="table table-striped table-hover table-list"><thead></thead><tbody></tbody></table><div class="table-btn text-center"></div>'
    , tplLink     : '<a href="%s" class="item-link" data-type="%s" data-menu="%s">%s</a>'
    , clsKeyword  : 'red'
    , clsSelected : 'info'
  }

  $.fn.ZCTable.Constructor = ZCTable

}(window.jQuery);