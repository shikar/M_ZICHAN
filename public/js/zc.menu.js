!function ($) {

  "use strict"

  var ZCMenu = function (el, opts) {
    this.opts = opts
    this.el = el
    this.menuData = []

    this.checkLoacAccessUrl()
    this.init()
  }

  ZCMenu.prototype = {

      constructor: ZCMenu
    , init: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          url      : this.opts.rootUrl + this.opts.ajaxMenu,
          success  : $.proxy(this.onAjaxMenuResult, this)
        })
      }
    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }

    , createMainThumbnail: function(menuId, subMenuId) {
        var i,j,menu,submenu
          , list = null

        for (i = 0; i < this.menuData.length; i++) {
          menu = this.menuData[i]
          if (menu.id !== menuId) continue
          for (var j = 0; j < menu.list.length; j++) {
            submenu = menu.list[j]
            if (submenu.id !== subMenuId) continue
            list = submenu.list
            break
          }
          if (list !== null) break
        }
        $('#main-block').ZCItemList({rootUrl:this.opts.rootUrl}).ZCItemList('show', list)
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 2 && arr[0] == '#m') {
          this.el.find('.menu li[data-menu='+arr[1]+'] a').trigger('click', [true])
          this.el.find('.sub-menu li[data-menu='+arr[1]+'][data-key='+arr[2]+'] a').trigger('click', [true])
        }
      }


    , onAjaxMenuResult: function(json) {
        var i,j,menu,subMenu,subMenuStr,badge,subMenuUrl
        this.menuData = json
        this.el.find('.menu').empty()
        this.el.find('.sub-menu').empty()
        for (i = 0; i < this.menuData.length; i++) {
          menu = this.menuData[i]
          subMenuStr = ''
          this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItemTitle, menu.id, menu.name))
          for (var j = 0; j < menu.list.length; j++) {
            subMenu = menu.list[j]
            badge = (subMenu.count>0?$.sprintf(this.opts.tplBadge, subMenu.count):'')
            this.el.find('.sub-menu').append($.sprintf(
              this.opts.tplSubItem,
              subMenu.id,
              subMenu.url,
              subMenu.type,
              menu.id,
              ( subMenu.list.length > 0 ? 'true' : 'false' ),
              subMenu.url,
              subMenu.name,
              subMenu.name,
              badge
            ))
          }
          badge = (menu.count>0?$.sprintf(this.opts.tplBadge, menu.count):'')
          this.el.find('.menu').append($.sprintf(this.opts.tplItem, menu.id, menu.name, this.opts.icons[i], menu.name+badge))
        }


        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
          placement: 'right',
          trigger: 'manual'
        }).bind({
          'mouseenter': $.proxy(this.onMenuMouseEnter, this),
          'mouseleave': $.proxy(this.onMenuMouseLeave, this),
        })
        this.el.find('.sub-menu li').hide()

        $('#header-block').on('click', '.btn-menu-toggle', $.proxy(this.onMenuToggleClick, this))
        this.el.find('.menu li a').bind('click', $.proxy(this.onMenuClick, this))
        this.el.find('.sub-menu li a').bind('click', $.proxy(this.onSubMenuClick, this))
        this.el.find('.sub-menu .close-sub-menu').bind('click', $.proxy(this.onSubMenuClose, this))

        this.checkHash()
      }
    , onMenuToggleClick: function(e) {
        if (this.el.hasClass('menu-open')) {
          $('.btn-menu-toggle .glyphicon').css({"-webkit-transform":"rotate(0deg)"})
          this.el.removeClass('menu-open')
        } else {
          $('.btn-menu-toggle .glyphicon').css({"-webkit-transform":"rotate(90deg)"})
          this.el.addClass('menu-open')
        }
      }
    , onMenuMouseEnter: function(e) {
        var self = $(e.currentTarget)
        if (!self.parents('.main').hasClass('menu-open')) self.tooltip('show')
      }
    , onMenuMouseLeave: function(e) {
        var self = $(e.currentTarget)
        self.tooltip('hide')
      }
    , onMenuClick: function(e, auto) {
        var self = $(e.currentTarget).parent()
          , menu = self.data('menu')
        this.el.find('.menu li').removeClass('active')
        self.addClass('active')

        this.el.find('.sub-menu li').hide()
        this.el.find('.sub-menu li[data-menu='+menu+']').show()
        this.el.find('.menu-content').addClass('submenu-open')

        if (!auto) this.el.find('.sub-menu li[data-menu='+menu+']:eq(1) a').trigger('click')
      }
    , onSubMenuClick: function(e, auto) {
        var self   = $(e.currentTarget)
          , parent = self.parent()
          , key    = parent.data('key')
          , url    = parent.data('url')
          , type   = parent.data('type')
          , menu   = parent.data('menu')
          , child  = parent.data('child')

        if (!auto) window.location.hash = '#m_' + menu + '_' + key

        if (type == 'blank') {
          self.attr({target: '_blank'})
          self.attr({href: self.attr('href')+window.location.hash})
        }
        if (type == 'open' || type == 'blank') return true

        this.el.find('.sub-menu li').removeClass('active')
        parent.addClass('active')

        if (child)
          this.createMainThumbnail(menu, key)
        else
          $(document).trigger({
            type  : "thumbnailShow",
            key   : key,
            url   : url,
            utype : type
          })

        return false
      }
    , onSubMenuClose: function(e) {
        this.el.find('.menu-content').removeClass('submenu-open')
      }
  }

  $.fn.ZCMenu = function (option) {
    var $this = $(this)
      , data = $this.data('ZCMenu')
      , opts = $.extend({}, $.fn.ZCMenu.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCMenu', (data = new ZCMenu(this, opts)))
    if (typeof option == 'string') data[option]()
    return $this
  }
  /**
   * menu 的 json 数据结构说明(相关json: menu.json, fav.json, searchResult.json)
   * id    : 用于识别菜单内容
   * icon  : 菜单的图片(只有二级以后有用)
   * name  : 菜单名称
   * count : 菜单的计数统计
   * list  : 子菜单
   * url   : 链接(只有二级以后有用)
   * type  : 菜单的类别
   *       def    : 调用默认的 ajax 地址
   *       open   : 本页跳转
   *       blank  : 新开一个
   *       ajax   : 自定义的 ajax 地址
   *       iframe : 不跳转以 iframe 的方式打开
   */

  $.fn.ZCMenu.defs = {
      rootUrl         : ''
    , icons           : ['glyphpro glyphpro-sampler','glyphpro glyphpro-server','glyphpro glyphpro-charts','glyphicon glyphicon-inbox','glyphpro glyphpro-pie_chart','glyphpro glyphpro-settings','glyphpro glyphpro-global']
    , ajaxMenu        : 'json/menu.json'
    , tplItem         : '<li data-menu="%s"><a href="javascript:void(null)" data-toggle="tooltip" title="%s"><span class="%s"></span> %s</li>'
    , tplSubItemTitle : '<li class="title" data-menu="%s">%s<div class="close-sub-menu pull-right"><span class="glyphicon glyphicon-triangle-left"></span></div></li>'
    , tplSubItem      : '<li data-key="%s" data-url="%s" data-type="%s" data-menu="%s" data-child="%s"><a href="%s" title="%s">%s %s</a></li>'
    , tplBadge        : ' <span class="badge">%s</span>'
  }

  $.fn.ZCMenu.Constructor = ZCMenu

}(window.jQuery);