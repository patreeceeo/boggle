this.boggle = this.boggle || {};

(function(boggle, Backbone, _) {
  "use strict";

  boggle.Model = Backbone.Model;

  boggle.Collection = Backbone.Collection;

  boggle.Letter = boggle.Model.extend({
    isqupdbn: function () {
      return _.any("qupdbn", function (letter) {
        return letter === this.attributes.letter;
      }, this);
    }
  });

  boggle.LetterCollection = boggle.Collection.extend({
    model: boggle.Letter,
    toString: function () {
      return this.reduce(function (memo, model) {
        return memo + model.get("letter");
      }, "");
    },
  });

  boggle.WordCollection = boggle.Collection.extend({
    contains: function (word) {
      return this.filter(function (model) {
        return word === model.get("word");
      }, this).length > 0;
    },
    addWords: function (words) {
      this.add(words.map(function (word) {
        return {word: word};
      }));
    }
  });

  boggle.Game = boggle.Model.extend({
    defaults: {
      gameState: "init",
      score: 0,
      scoreDelta: 0
    },
    score: function (word) {
      var score = this.get("score"),
          scoreDelta = boggle.scoreWord(word);
      this.set({
        score: score + scoreDelta,
        scoreDelta: scoreDelta
      });
    }
  });

  boggle.Clock = boggle.Model.extend({
    defaults: {
      "minutes": 2,
      "seconds": 0
    },
    initialize: function () {
      return this;
    },
    start: function () {
      var self = this;
      this.iid = setInterval(function () {
        var json = self.toJSON();
        if(json.seconds === 0) {
          json.minutes -= 1;
          json.seconds = 59;
        } else {
          json.seconds -= 1;
        }
        if(json.minutes === 0 && json.seconds === 0) {
          clearInterval(self.iid);
          self.trigger("timeup");
        }
        self.set(json);
      }, 1000);
      return this;
    },
    pause: function () {
      clearInterval(this.iid);
      return this;
    },
    finish: function () {
      this.pause();
      this.set({
        minutes: 0,
        seconds: 0
      });
      return this;
    },
    reset: function () {
      this.pause();
      this.set(this.defaults);
      return this;
    }
  });

})(this.boggle, this.Backbone, this._);
