!function ($) {

  "use strict"

  var ZCMenu = function (el, opts) {
    this.opts = opts
    this.el = el
    this.menuData = []
    this.urlPath = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    this.init()
  }

  ZCMenu.prototype = {

      constructor: ZCMenu
    , init: function() {
        $.ajax({
          cache    : false,
          dataType : "json",
          url      : this.urlPath + this.opts.ajaxMenu,
          success  : $.proxy(this.onAjaxMenuResult, this)
        })
      }

    , createMainThumbnail: function(menu, idx) {
        var item,items = ''
        console.log(this.menuData[menu]['list'][idx]['list'])
        for (var i = 0; i < this.menuData[menu]['list'][idx]['list'].length; i++) {
          item = this.menuData[menu]['list'][idx]['list'][i]
          items += $.sprintf(this.opts.tplThumbnail, 'holder.js/150x150?random=yes&size=1&text=150x150 \\n '+item.name, item.name, item.ds)
        }
        $('#main-block').html($.sprintf(this.opts.tplMain, items))

        Holder.run()
      }

    , onAjaxMenuResult: function(json) {
        var i,j,menu,subMenu,subMenuStr,badge
        this.menuData = json
        this.el.find('.menu').empty()
        this.el.find('.sub-menu').empty()
        for (i = 0; i < this.menuData.length; i++) {
          menu = this.menuData[i]
          subMenuStr = ''
          this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItemTitle, i, menu.name))
          for (var j = 0; j < menu.list.length; j++) {
            subMenu = menu.list[j]
            badge = (subMenu.count>0?$.sprintf(this.opts.tplBadge, subMenu.count):'')
            this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItem, i, j, ( subMenu.list.length > 0 ? 'true' : 'false' ), subMenu.name, subMenu.name, badge))
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

        $('.btn-menu-toggle').bind('click', $.proxy(this.onMenuToggleClick, this))
        this.el.find('.menu li a').bind('click', $.proxy(this.onMenuClick, this))
        this.el.find('.sub-menu li a').bind('click', $.proxy(this.onSubMenuClick, this))
        this.el.find('.sub-menu .close-sub-menu').bind('click', $.proxy(this.onSubMenuClose, this))
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
        if (sub) this.createMainThumbnail(menu, idx)
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
  }

  $.fn.ZCMenu.defs = {
      localAccessUrl  : 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , icons           : ['glyphpro glyphpro-sampler','glyphpro glyphpro-server','glyphpro glyphpro-charts','glyphicon glyphicon-inbox','glyphpro glyphpro-pie_chart','glyphpro glyphpro-settings','glyphpro glyphpro-global']
    , ajaxMenu        : 'json/menu.json'
    , tplItem         : '<li data-menu="%s"><a href="javascript:void(null)" data-toggle="tooltip" title="%s"><span class="%s"></span> %s</li>'
    , tplSubItemTitle : '<li class="title" data-menu="%s">%s<div class="close-sub-menu pull-right"><span class="glyphicon glyphicon-triangle-left"></span></div></li>'
    , tplSubItem      : '<li data-menu="%s" data-idx="%s" data-child="%s"><a href="javascript:void(null)" title="%s">%s %s</a></li>'
    , tplBadge        : ' <span class="badge">%s</span></a>'

    , tplMain         : '<div class="container-fluid"><div class="row">%s</div></div>'
    , tplThumbnail    : '<div class="col-sm-3"><div class="thumbnail"><img data-src="%s"><div class="caption"><h5>%s</h5><p class="text-muted small">%s</p></div></div></div>'
  }

  $.fn.ZCMenu.Constructor = ZCMenu

}(window.jQuery);