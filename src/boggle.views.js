this.boggle = this.boggle || {};

(function(boggle, Backbone, _) {
  "use strict";
  var views = {};

  views.Base = Backbone.View.extend({
    initialize: function (options) {
      options = options || {};
      this.children = options.children || {};
      if(this.model != null) {
        this.bindModelEvents(this.model, this.modelEvents);
      }
      if(this.collection != null) {
        this.bindModelEvents(this.collection, this.collectionEvents);
      }
    },
    render: function () {
      this.$el.html(this.html());
      _.each(this.children, this.assignChild, this);
    },
    assignChild: function (view, selector) {
      view.setElement(this.$(selector)).render();
    },
    bindModelEvents: function (model, modelEvents) {
      _.each(modelEvents, function (methodName, eventString) {
        var method = this[methodName] || methodName;
        this.listenTo(model, eventString, method);
      }, this);
    },
    remove: function () {
      _.each(this.children, function (view) {
        view.stopListening();
      }, this);
      this._super("remove");
    },
    _super: function (method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return this.constructor.__super__[method].apply(this, args);
    }
  });

  views.Game = views.Base.extend({
    html: function () {
      return "<div id='LetterGrid-container'></div>" +
             "<div id='Typewritter-container'></div>" +
             "<div id='Answers-container'></div>" +
             "<div id='CorrectAnswers-container'></div>";
    }
  });

  views.LetterGrid = views.Base.extend({
    initialize: function (options) {
      this._super("initialize");
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

  views.Typewritter = views.Base.extend({
    initialize: function () {
      this._super("initialize");
      _.bindAll(this, "_keyDowned");
      document.body.addEventListener("keydown", this._keyDowned);
      var self = this;
      setInterval(function () {
        self.$(".Typewritter-cursor").toggleClass("u-hidden");
      }, 600);
    },
    html: function () {
      return this.collection.map(function (model) {
        var json = model.toJSON();
        return "<div class='Block u-widthHalf'>"+json.letter+"</div>";
      }).join("") + "<div class='Block Typewritter-cursor'>&brvbar;</div>";
    },
    collectionEvents: {
      "add remove reset": "render"
    },
    _keyDowned: function (e) {
      var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          letter;

      if(e.keyCode >= 65 && e.keyCode <= 90) {
        letter = abc[e.keyCode - 65];
      }
      if(e.keyCode >= 97 && e.keyCode <= 122) {
        letter = abc[e.keyCode - 97];
      }

      if(e.metaKey && e.keyCode !== 8) {
        return;
      }

      e.preventDefault();

      if(e.keyCode === 13) {
        var word = "" + this.collection;
        this.trigger("enter", word);
        this.collection.reset();
      }

      if(letter != null) {
        this.collection.push({
          letter: letter
        });
      }

      if(e.keyCode === 8) {
        if(e.metaKey) {
          this.collection.reset();
        } else {
          this.collection.pop();
        }
      }
    }
  });

  views.WordList = views.Base.extend({
    collectionEvents: {
      "add remove": "render"
    },
    html: function () {
      var items = this.collection.map(function (model) {
        var json = model.toJSON();
        return "<li>"+json.word+"</li>"; 
      }).join("");
      return "<ul>"+items+"</ul>";
    }
  });

  boggle.views = views;
})(this.boggle, this.Backbone, this._);
