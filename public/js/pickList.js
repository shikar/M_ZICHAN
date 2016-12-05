(function ($) {

  $.fn.pickList = function (options) {

    var opts = $.extend({}, $.fn.pickList.defaults, options);

    this.fill = function () {
      var pickThis = this;
      pickThis.find('option').each(function(index, el) {
        var $el = $(el)
        if ($el.attr('selected'))
          pickThis.parent().find('.pickListResult').append('<option value="' + $el.val()+'">' + $el.text() + '</option>');
        else
          pickThis.parent().find('.pickData').append('<option value="' + $el.val()+'">' + $el.text() + '</option>');
      });
    };
    this.controll = function () {
       var $this = this;
       var pickThis = this.parent();

       pickThis.find(".pAdd").on('click', function () {
          var p = pickThis.find(".pickData option:selected");
          p.clone().appendTo(pickThis.find(".pickListResult"));
          p.remove();
          $this.checkSelected();
       });

       pickThis.find(".pAddAll").on('click', function () {
          var p = pickThis.find(".pickData option");
          p.clone().appendTo(pickThis.find(".pickListResult"));
          p.remove();
          $this.checkSelected();
       });

       pickThis.find(".pRemove").on('click', function () {
          var p = pickThis.find(".pickListResult option:selected");
          p.clone().appendTo(pickThis.find(".pickData"));
          p.remove();
          $this.checkSelected();
       });

       pickThis.find(".pRemoveAll").on('click', function () {
          var p = pickThis.find(".pickListResult option");
          p.clone().appendTo(pickThis.find(".pickData"));
          p.remove();
          $this.checkSelected();
       });

       pickThis.find(".pickData").on('dblclick', function () {
          var p = pickThis.find(".pickData option:selected");
          p.clone().appendTo(pickThis.find(".pickListResult"));
          p.remove();
          $this.checkSelected();
       });

       pickThis.find(".pickListResult").on('dblclick', function () {
          var p = pickThis.find(".pickListResult option:selected");
          p.clone().appendTo(pickThis.find(".pickData"));
          p.remove();
          $this.checkSelected();
       });
    };

    this.checkSelected = function () {
      var $this = this;
      $this.find('option').attr('selected', false);
      $this.parent().find('.pickListResult option').each(function(idx1, el1) {
        var $el1 = $(el1)
        $this.find('option').each(function(idx2, el2) {
          var $el2 = $(el2)
          if ($el1.val() == $el2.val()) $el2.attr('selected', true)
        });
      });
    };

    this.init = function () {
       var pickListHtml =
               "<div class='row'>" +
               "  <div class='col-sm-5'>" +
               "   <select class='form-control pickListSelect pickData' multiple></select>" +
               " </div>" +
               " <div class='col-sm-2 pickListButtons'>" +
               "  <button class='pAdd btn btn-primary btn-sm' type='button'>" + opts.add + "</button><br>" +
               "  <button class='pAddAll btn btn-primary btn-sm' type='button'>" + opts.addAll + "</button><br>" +
               "  <button class='pRemove btn btn-primary btn-sm' type='button'>" + opts.remove + "</button><br>" +
               "  <button class='pRemoveAll btn btn-primary btn-sm' type='button'>" + opts.removeAll + "</button><br>" +
               " </div>" +
               " <div class='col-sm-5'>" +
               "    <select class='form-control pickListSelect pickListResult' multiple></select>" +
               " </div>" +
               "</div>";

       this.parent().append(pickListHtml);
       this.hide();
       this.fill();
       this.controll();
    };

    this.init();
    return this;
  };

  $.fn.pickList.defaults = {
    add       : 'Add',
    addAll    : 'Add All',
    remove    : 'Remove',
    removeAll : 'Remove All'
  };


}(jQuery));
