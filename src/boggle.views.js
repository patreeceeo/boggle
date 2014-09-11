this.boggle = this.boggle || {};

(function(boggle, Backbone, _) {
  "use strict";
  var views = {};

  views.Base = Backbone.View.extend({
    render: function () {
      this.$el.html(this.html());
    }
  });

  views.LetterGrid = views.Base.extend({
    initialize: function (options) {
      this.letterGrid = options.letterGrid;
      this.width = options.width;
      this.height = options.height;
    },
    _block: function (options) {
      return "<div class='Block u-width" + options.width +
          " u-height" + options.height + "'>" + options.content + "</div>";
    },
    html: function () {
      var blocks = _.map(this.letterGrid, function (letter) {
        return this._block({
          width: 1,
          height: 1,
          content: letter
        });
      }, this).join("");
      return this._block({
        width: this.width,
        height: this.height,
        content: blocks
      });
    }
  });

  boggle.views = views;
})(this.boggle, this.Backbone, this._);
