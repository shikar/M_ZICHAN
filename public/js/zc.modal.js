!function ($) {

  "use strict"

  var ZCModal = function (el, opts) {
    this.el = el
    this.opts = opts
    this.id = 'modal'+parseInt(Math.random()*10000)
    this.$modal = null

    this.checkLoacAccessUrl()
    this.init()
  }

  ZCModal.prototype = {

      constructor: ZCModal
    , init: function() {
        $('body').append($.sprintf(this.opts.tplMain, this.id, this.opts.title, this.opts.body))
        this.$modal = $('#'+this.id)
        if (this.opts.size == 'large')
          this.$modal.find('.modal-dialog').addClass('modal-lg')
        else if (this.opts.size == 'small')
          this.$modal.find('.modal-dialog').addClass('modal-sm')

        this.$modal.modal({
          backdrop : this.opts.backdrop,
          show     : this.opts.show,
          remote   : this.opts.rootUrl+this.opts.remote,
        })
        .bind('hidden.bs.modal', $.proxy(this.onHidden, this))
        .bind('loaded.bs.modal', $.proxy(this.onLoaded, this))
        .modal('show')
      }
    , checkLoacAccessUrl: function() {
        var protocol = window.location.protocol
        if (protocol == 'file:' && navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          this.opts.rootUrl = 'https://raw.githubusercontent.com/shikar/M_ZICHAN/master/public/' + this.opts.rootUrl
        }
      }
    , cloas: function() {
        this.$modal.modal('hide')
      }
    , destroy: function() {

      }

    , onHidden: function(e) {
        this.$modal.remove()
      }
    , onLoaded: function(e) {
        var form = this.$modal.find('form')
          , submit = this.$modal.find('[type=submit]')
        if (form) {
          form.bind('submit', $.proxy(this.onSubmit, this))
          if (submit) submit.bind('click', $.proxy(this.onSubmitClick, this))
        }
      }
    , onSubmitClick: function(e) {
        this.$modal.find('[type=submit]').button('loading')
        this.$modal.find('form').trigger('submit')
        setTimeout($.proxy(this.onSetTimeOut, this), 4000)
      }
    , onSubmit: function(e) {
        this.$modal.find('form').ajaxSubmit({
          beforeSubmit : $.proxy(this.onBeforeSubmit, this),
          complete     : $.proxy(this.onSubmitComplete, this)
        })
        return false
      }
    , onBeforeSubmit: function(formData, jqForm, options) {
        var queryString = $.param(formData)
        console.log('提交的信息: \n' + queryString)
      }
    , onSubmitComplete: function(e) {
        console.log('onSubmitSuccess', e)
        this.$modal.find('.modal-dialog').removeClass('modal-lg').addClass('modal-sm')
        this.$modal.find('[type=submit]').remove()
        this.$modal.find('.modal-body').html(e.responseText)
      }
    , onSetTimeOut: function() {
        this.$modal.find('[type=submit]').button('reset')
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