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

    , createMainThumbnail: function(id) {
        var item,items = ''
          , id = id.split('_')
        console.log(this.menuData[id[0]]['list'][id[1]]['list'])
        for (var i = 0; i < this.menuData[id[0]]['list'][id[1]]['list'].length; i++) {
          item = this.menuData[id[0]]['list'][id[1]]['list'][i]
          items += $.sprintf(this.opts.tplThumbnail, 'holder.js/253x140?random=yes&size=1&text=253x140 \\n '+item.name, item.name, item.ds)
        }
        $('#main-block').html($.sprintf(this.opts.tplMain, items))

        Holder.run()
      }

    , onAjaxMenuResult: function(json) {
        var i,j,menu,subMenu,subMenuStr
        this.menuData = json
        this.el.html(this.opts.tplMemu)
        for (i = 0; i < this.menuData.length; i++) {
          menu = this.menuData[i]
          subMenuStr = ''
          for (var j = 0; j < menu.list.length; j++) {
            subMenu = menu.list[j]
            subMenuStr += $.sprintf(
              this.opts.tplSubItem,
              i+'_'+j,
              ( subMenu.list.length > 0 ? 'true' : 'false' ),
              subMenu.name + ( subMenu.list.length > 0 ? ' <span class="caret"></span>' : '' )
            )
          }
          this.el.find('#menu').append($.sprintf(this.opts.tplItem, this.opts.icons[i], menu.name, subMenuStr))
        }
        this.el.find('.txt').animate({width:'toggle'}, 0)

        $('.btn-menu-toggle').bind('click', $.proxy(this.onMenuToggleClick, this))
        this.el.find('.dropdown-menu li a').bind('click', $.proxy(this.onSubMenuClick, this))
      }
    , onMenuToggleClick: function(e) {
        if (this.el.find('.txt').css('display') == 'none') $('.btn-menu-toggle .glyphicon').css({"-webkit-transform":"rotate(90deg)"})
        else $('.btn-menu-toggle .glyphicon').css({"-webkit-transform":"rotate(0deg)"})
        this.el.find('.txt').animate({width:'toggle'}, 200)
      }
    , onSubMenuClick: function(e) {
        var self = $(e.currentTarget)
          , id = self.data('id')
          , sub = self.data('sub')

        console.log(id)
        if (sub) this.createMainThumbnail(id)
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
      localAccessUrl : 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/'
    , icons          : ['glyphpro glyphpro-sampler','glyphpro glyphpro-server','glyphpro glyphpro-charts','glyphicon glyphicon-inbox','glyphpro glyphpro-pie_chart','glyphpro glyphpro-settings','glyphpro glyphpro-global']
    , ajaxMenu       : 'json/menu.json'
    , tplMemu        : '<ul id="menu" class="nav nav-pills nav-stacked"></ul>'
    , tplItem        : '<li class="dropright"><a href="javascript:void(null)" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="%s"></span> <span class="txt">%s <span class="caret"></span></span></a><ul class="dropdown-menu">%s</ul></li>'
    , tplSubItem     : '<li><a href="javascript:void(null)" data-id="%s" data-sub="%s">%s</a></li>'
    , tplMain        : '<div class="container"><div class="row">%s</div></div>'
    , tplThumbnail   : '<div class="col-sm-3"><div class="thumbnail"><img data-src="%s"><div class="caption"><h4>%s</h4><p>%s</p></div></div></div>'
  }

  $.fn.ZCMenu.Constructor = ZCMenu

}(window.jQuery);