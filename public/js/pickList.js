(function ($) {

   $.fn.pickList = function (options) {

      var opts = $.extend({}, $.fn.pickList.defaults, options);

      this.fill = function () {
         var option = '';

         $.each(opts.data, function (key, val) {
            option += '<option data-id=' + val.id + '>' + val.text + '</option>';
         });
         this.find('.pickData').append(option);
      };
      this.controll = function () {
         var pickThis = this;

         pickThis.find(".pAdd").on('click', function () {
            var p = pickThis.find(".pickData option:selected");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
         });

         pickThis.find(".pAddAll").on('click', function () {
            var p = pickThis.find(".pickData option");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
         });

         pickThis.find(".pRemove").on('click', function () {
            var p = pickThis.find(".pickListResult option:selected");
            p.clone().appendTo(pickThis.find(".pickData"));
            p.remove();
         });

         pickThis.find(".pRemoveAll").on('click', function () {
            var p = pickThis.find(".pickListResult option");
            p.clone().appendTo(pickThis.find(".pickData"));
            p.remove();
         });

         pickThis.find(".pickData").on('dblclick', function () {
            var p = pickThis.find(".pickData option:selected");
            p.clone().appendTo(pickThis.find(".pickListResult"));
            p.remove();
         });

         pickThis.find(".pickListResult").on('dblclick', function () {
            var p = pickThis.find(".pickListResult option:selected");
            p.clone().appendTo(pickThis.find(".pickData"));
            p.remove();
         });
      };

      this.getValues = function () {
         var objResult = [];
         this.find(".pickListResult option").each(function () {
            objResult.push({
               id: $(this).data('id'),
               text: this.text
            });
         });
         return objResult;
      };

      this.init = function () {
         var pickListHtml =
                 "<div class='row'>" +
                 "  <div class='col-sm-5'>" +
                 "	 <select class='form-control pickListSelect pickData' multiple></select>" +
                 " </div>" +
                 " <div class='col-sm-2 pickListButtons'>" +
                 "	<button class='pAdd btn btn-primary btn-sm' type='button'>" + opts.add + "</button><br>" +
                 "  <button class='pAddAll btn btn-primary btn-sm' type='button'>" + opts.addAll + "</button><br>" +
                 "	<button class='pRemove btn btn-primary btn-sm' type='button'>" + opts.remove + "</button><br>" +
                 "	<button class='pRemoveAll btn btn-primary btn-sm' type='button'>" + opts.removeAll + "</button><br>" +
                 " </div>" +
                 " <div class='col-sm-5'>" +
                 "    <select class='form-control pickListSelect pickListResult' name='" + opts.name + "' multiple></select>" +
                 " </div>" +
                 "</div>";

         this.append(pickListHtml);

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
      removeAll : 'Remove All',
      name      : 'multSelect'
   };


}(jQuery));
