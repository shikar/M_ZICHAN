!function ($) {

  "use strict"

  var ZCMenu = function (el, opts) {
    this.opts = opts
    this.el = el
    this.menuData = []
    this.urlPath = ''

    if (navigator.userAgent.toLowerCase().match(/chrome/) != null) this.urlPath = this.opts.localAccessUrl
    console.log('ZCMenu')
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
          items += $.sprintf(this.opts.tplThumbnail, 'holder.js/253x140?random=yes&size=1&text=253x140 \\n '+item.name, item.name, item.ds)
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
            badge = (subMenu.count>0?$.sprintf(this.opts.tplBadge, 99):'')
            this.el.find('.sub-menu').append($.sprintf(this.opts.tplSubItem, i, j, ( subMenu.list.length > 0 ? 'true' : 'false' ), subMenu.name+badge))
          }
          badge = (menu.count?$.sprintf(this.opts.tplBadge, 99):'')
          this.el.find('.menu').append($.sprintf(this.opts.tplItem, i, this.opts.icons[i], menu.name+badge))
        }

        $('.btn-menu-toggle').bind('click', $.proxy(this.onMenuToggleClick, this))

        this.el.find('.sub-menu li').hide()
        this.el.find('.menu li a').bind('click', $.proxy(this.onMenuClick, this))
        this.el.find('.sub-menu li a').bind('click', $.proxy(this.onSubMenuClick, this))
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
    , tplItem         : '<li data-menu="%s"><a href="javascript:void(null)"><span class="%s"></span> %s</li>'
    , tplSubItemTitle : '<li class="title" data-menu="%s">%s</li>'
    , tplSubItem      : '<li data-menu="%s" data-idx="%s" data-child="%s"><a href="javascript:void(null)">%s</a></li>'
    , tplBadge        : ' <span class="badge">99</span></a>'

    , tplMain         : '<div class="container"><div class="row">%s</div></div>'
    , tplThumbnail    : '<div class="col-sm-3"><div class="thumbnail"><img data-src="%s"><div class="caption"><h4>%s</h4><p>%s</p></div></div></div>'
  }

  $.fn.ZCMenu.Constructor = ZCMenu

}(window.jQuery);