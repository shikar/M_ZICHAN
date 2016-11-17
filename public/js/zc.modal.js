!function ($) {

  "use strict"

  var ZCModal = function (el, opts) {
    this.el = el
    this.opts = opts
    this.id = 'modal'+parseInt(Math.random()*10000)

    this.checkLoacAccessUrl()
    this.init()
  }

  ZCModal.prototype = {

      constructor: ZCModal
    , init: function() {
        $('body').append($.sprintf(this.opts.tplMain, this.id, this.opts.title, this.opts.body))
        if (this.opts.size == 'large')
          $('#'+this.id).find('.modal-dialog').addClass('modal-lg')
        else if (this.opts.size == 'small')
          $('#'+this.id).find('.modal-dialog').addClass('modal-sm')

        $('#'+this.id).modal({
          backdrop : this.opts.backdrop,
          show     : this.opts.show,
          remote   : this.opts.remote,
        })
        .bind('hidden.bs.modal', $.proxy(this.onHidden, this))
        .modal('show')
      }
    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }
    , cloas: function() {
        $('#'+this.id).modal('hide')
      }
    , destroy: function() {

      }

    , onHidden: function(e) {
        $('#'+this.id).remove()
      }

  }

  $.fn.ZCModal = function () {
    var $this = $(this)
      , args = []
      , option = arguments[0]
      , data = $this.data('ZCModal')
      , opts = $.extend({}, $.fn.ZCModal.defs, typeof option == 'object' && option)
    if (!data) $this.data('ZCModal', (data = new ZCModal($this, opts)))

    if (typeof option == 'string') {
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i])
      data[option].apply(data, args)
    }
  }

  $.fn.ZCModal.defs = {
      rootUrl  : ''
    , title    : ''
    , body     : ''
    , remote   : ''
    , show     : false
    , size     : 'def' // lager, def, small
    , backdrop : 'static'
    , tplMain  : '<div id="%s" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">%s</h4></div><div class="modal-body">%s</div><div class="modal-footer"></div></div></div></div>'
  }

  $.fn.ZCModal.Constructor = ZCModal

}(window.jQuery);