this.boggle = this.boggle || {};

!(function(boggle) {
  "use strict";

  var IncompleteWord;
  
  IncompleteWord = function (letter, index, x, y) {
    this.letters = [{letter: letter, index: index, x: x, y: y}];
  };

  IncompleteWord.prototype.firstLetter = function () {
    return this.letters[0].letter;
  };

  IncompleteWord.prototype.lastLetter = function () {
    return this.letters[this.letters.length - 1].letter;
  };

  IncompleteWord.prototype.last = function () {
    return this.letters[this.letters.length - 1];
  };

  IncompleteWord.prototype.first = function () {
    return this.letters[0];
  };

  IncompleteWord.prototype.isSuffix = function (incompleteWord, wordList) {
    var word, truncWordList, self;
    self = this;
    word = "" + this + incompleteWord;
    truncWordList = wordList.map(function (w) {
      return w.slice(self.first().index, incompleteWord.last().index + 2);
    });
    return truncWordList.indexOf(word) != -1;
  };
 
  IncompleteWord.prototype.isPrefix = function (incompleteWord, wordList) {
    var word, truncWordList, self;
    self = this;
    word = "" + incompleteWord + this;
    truncWordList = wordList.map(function (w) {
      return w.slice(incompleteWord.first().index - 1, self.last().index + 1);
    });
    return truncWordList.indexOf(word) != -1;
  };

  IncompleteWord.prototype.clone = function (letters) {
    var clone;
    clone = new IncompleteWord();
    clone.letters = letters;
    return clone;
  };

  IncompleteWord.prototype.prepend = function (incompleteWord) {
    return this.clone(incompleteWord.letters.concat(this.letters));
  };

  IncompleteWord.prototype.append = function (incompleteWord) {
    return this.clone(this.letters.concat(incompleteWord.letters));
  };

  IncompleteWord.prototype.toString = function () {
    return this.letters.map(function (el) {
      return el.letter;
    }).join("");
  };

  IncompleteWord.prototype.isInList = function (list) {
    return list.indexOf(this.toString()) !== -1;
  };

  boggle.IncompleteWord = IncompleteWord;
})(this.boggle);
