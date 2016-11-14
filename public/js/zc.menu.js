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
        if (protocol == 'file' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }

    , createMainThumbnail: function(menu, idx) {
        var item,items = ''
        $('#main-block').ZCItemList('show', this.menuData[menu]['list'][idx]['list'])
      }
    , checkHash: function() {
        var hash = window.location.hash
          , arr = hash.split('_')
        if (arr.length > 2 && arr[0] == '#m') {
          this.el.find('.menu li[data-menu='+arr[1]+'] a').trigger('click')
          this.el.find('.sub-menu li[data-menu='+arr[1]+'][data-idx='+arr[2]+'] a').trigger('click')
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
          this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItemTitle, i, menu.name))
          for (var j = 0; j < menu.list.length; j++) {
            subMenu = menu.list[j]
            subMenuUrl = (subMenu.hasOwnProperty('url')?subMenu.url:'')
            badge = (subMenu.count>0?$.sprintf(this.opts.tplBadge, subMenu.count):'')
            this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItem, subMenu.id, '', i, j, ( subMenu.list.length > 0 ? 'true' : 'false' ), subMenuUrl, i, j, subMenu.name, subMenu.name, badge))
          }
          badge = (menu.count>0?$.sprintf(this.opts.tplBadge, menu.count):'')
          this.el.find('.menu').append($.sprintf(this.opts.tplItem, i, menu.name, this.opts.icons[i], menu.name+badge))
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
    , onMenuClick: function(e) {
        var self = $(e.currentTarget).parent()
          , menu = self.data('menu')
        this.el.find('.menu li').removeClass('active')
        self.addClass('active')

        this.el.find('.sub-menu li').hide()
        this.el.find('.sub-menu li[data-menu='+menu+']').show()

        this.el.find('.menu-content').addClass('submenu-open')
      }
    , onSubMenuClick: function(e) {
        var self = $(e.currentTarget).parent()
          , menu = self.data('menu')
          , idx = self.data('idx')
          , sub = self.data('child')

        this.el.find('.sub-menu li').removeClass('active')
        self.addClass('active')
        // console.log(menu,idx,sub)
        if (sub)
          this.createMainThumbnail(menu, idx)
        else
          $(document).trigger({
            type : "thumbnailShow",
            key  : self.data('key'),
            ajax : self.data('ajax')
          })
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

  $.fn.ZCMenu.defs = {
      rootUrl         : ''
    , icons           : ['glyphpro glyphpro-sampler','glyphpro glyphpro-server','glyphpro glyphpro-charts','glyphicon glyphicon-inbox','glyphpro glyphpro-pie_chart','glyphpro glyphpro-settings','glyphpro glyphpro-global']
    , ajaxMenu        : 'json/menu.json'
    , tplItem         : '<li data-menu="%s"><a href="javascript:void(null)" data-toggle="tooltip" title="%s"><span class="%s"></span> %s</li>'
    , tplSubItemTitle : '<li class="title" data-menu="%s">%s<div class="close-sub-menu pull-right"><span class="glyphicon glyphicon-triangle-left"></span></div></li>'
    , tplSubItem      : '<li data-key="%s" data-ajax="%s" data-menu="%s" data-idx="%s" data-child="%s"><a href="%s#m_%s_%s" title="%s">%s %s</a></li>'
    , tplBadge        : ' <span class="badge">%s</span>'
  }

  $.fn.ZCMenu.Constructor = ZCMenu

}(window.jQuery);