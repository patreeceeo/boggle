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
      if(typeof this.afterRender === "function") {
        this.afterRender.apply(this, arguments);
      }
    },
    assignChild: function (view, key) {
      view.setElement(this.$("#"+key)).render();
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
      return "<div class='u-fixedTop'><div id='clock'></div>" +
             "<div id='letterGrid'></div></div>" +
             "<div id='typewritter' class='u-fixedBottom'></div>" +
             "<div id='answers' " +
              "class='u-gridWidthMargin u-clockHeightMargin u-scrollContainer u-zAnswers'></div>";
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
          " u-height" + options.height + " " + options.className + "'>" + 
          options.content + "</div>";
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
        content: blocks,
        className: "LetterGrid"
      });
    }
  });

  views.Typewritter = views.Base.extend({
    initialize: function () {
      this._super("initialize");
      _.bindAll(this, "_keyDowned");
    },
    html: function () {
      return "<div class='Typewritter'>" + this.collection.map(function (model) {
        var json = model.toJSON();
        return "<div class='Block u-widthHalf'>"+json.letter+"</div>";
      }).join("") + "<div class='Block Typewritter-cursor'>&brvbar;</div></div>";
    },
    afterRender: function () {
      this.$cursor = this.$(".Typewritter-cursor");
    },
    collectionEvents: {
      "add remove reset": "render"
    },
    modelEvents: {
      "change:gameState": "_changeState"
    },
    _changeState: function () {
      var self = this;
      switch(this.model.get("gameState")) {
        case "playing":
          document.body.addEventListener("keydown", this._keyDowned);
          this._cursorInterval = setInterval(function () {
            self.$cursor.toggleClass("u-hidden");
          }, 600);
          this.$(".Typewritter").removeClass("Typewritter--wrong");
          break;
        case "wrong":
          clearInterval(this._cursorInterval);
          document.body.removeEventListener("keydown", this._keyDowned);
          this.$cursor.addClass("u-hidden");
          this.$(".Typewritter").addClass("Typewritter--wrong");
          break;
        case "over":
          clearInterval(this._cursorInterval);
          document.body.removeEventListener("keydown", this._keyDowned);
          this.collection.reset();
          this.$cursor.addClass("u-hidden");
          break;
      }
    },
    _keyDowned: function (e) {
      var abc = "abcdefghijklmnopqrstuvwxyz",
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
      }

      if(letter != null && this.collection.length < 16) {
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
      "add remove change:found": "render"
    },
    modelEvents: {
      "change:gameState": "render"
    },
    html: function () {
      var gameState = this.model.get("gameState");
      var items = this.collection.map(function (model) {
        var json = model.toJSON();
        if(json.found) {
          return "<li><div class='Answers-accentContainer'>" + 
                 "<div class='Answers-checkIcon'>&check;</div>" +
                 "<div class='Answers-text'>" +
                 "<a target='_blank' href='https://www.google.com/webhp#q=define+"+json.word+"'>"+json.word+"</a>" +
                 "</div>" +
                 "<div class='Answers-accent'></div></div></li>"; 
        } else {
          if(gameState != "over") {
            return "<li><div class='Answers-accentContainer'>" +
                   "<div class='Answers-checkIcon'></div>" +
                   "<div class='Answers-accent'></div></div></li>"; 
          } else {
            return "<li><div class='Answers-accentContainer'>" +
                   "<div class='Answers-checkIcon'></div>" +
                   "<div class='Answers-text'>" +
                   "<a target='_blank' href='https://www.google.com/webhp#q=define+"+json.word+"'>"+json.word+"</a>" +
                   "</div>" +
                   "<div class='Answers-accent'></div></div></li>"; 
          }
        }
      }).join("");
      return "<ul class='Answers'>"+items+"</ul>";
    },
    afterRender: function (changedModel) {
      var self = this;
      if(changedModel != null) {
        this.$(".Answers-text").each(function (index, el) {
          if($(el).text().trim() === changedModel.get("word")) {
            self.$el.scrollTop($(el).offset().top - $(el).outerHeight());
          }
        });
      }
    }
  });

  views.Clock = views.Base.extend({
    html: function () {
      var json = this.model.toJSON();
      var seconds = "" + json.seconds;
      if(seconds.length == 1) {
        seconds = "0" + seconds;
      }
      if(json.minutes === 0) {
        if(json.seconds <= 30) {
          return "<div class='Clock Clock--alert'>t - :" + seconds + "</div>";
        } else {
          return "<div class='Clock'>t - :" + seconds + "</div>";
        }
      } else {
        return "<div class='Clock'>t - " + json.minutes + ":" + seconds + "</div>";
      }
    },
    events: {
      "click": function () {
         this.model.set({
           minutes: 0,
           seconds: 1
         });
      }
    },
    modelEvents: {
      "change:seconds": "render"
    }
  });

  boggle.views = views;
})(this.boggle, this.Backbone, this._);
