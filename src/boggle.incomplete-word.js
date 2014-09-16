this.boggle = this.boggle || {};

!(function(boggle) {
  "use strict";

  var IncompleteWord;
  
  IncompleteWord = function (letter, index, word, x, y) {
    this.letters = [{
      letter: letter, 
      index: index, 
      x: x, 
      y: y,
      trapped: {}
    }];
    this.completeWord = word;
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

  IncompleteWord.indexInSortedList = function (wordList, word) {
    var jump = wordList.length / 2,
        testIndex;
    testIndex = jump;
    do {
      jump = Math.floor(jump / 2);
      if(word < wordList[testIndex]) {
        testIndex += jump;
      } else if(word > wordList[testIndex]) {
        testIndex -= jump;
      } else {
        return testIndex;
      }
    } while(jump > 0);
    return -1;
  };

  IncompleteWord.prototype.isSuffix = function (incompleteWord) {
    var nextLetter = incompleteWord.first(),
        letter = this.last();
    return incompleteWord.completeWord == this.completeWord && 
           nextLetter.index === letter.index + 1;
  };

  IncompleteWord.prototype.isPrefix = function (incompleteWord) {
    var nextLetter = this.first(),
        letter = incompleteWord.last();
    return incompleteWord.completeWord == this.completeWord && 
           nextLetter.index === letter.index + 1;
  };

  IncompleteWord.prototype.clone = function () {
    var clone;
    clone = new IncompleteWord();
    clone.letters = [].concat(this.letters);
    return clone;
  };

  IncompleteWord.prototype.prepend = function (incompleteWord) {
    this.letters = incompleteWord.letters.concat(this.letters);
  };

  IncompleteWord.prototype.append = function (incompleteWord) {
    this.letters = this.letters.concat(incompleteWord.letters);
  };

  IncompleteWord.prototype.toString = function () {
    return this.letters.map(function (el) {
      return el.letter;
    }).join("");
  };

  IncompleteWord.prototype.isInList = function (list) {
    if(list.length < 5000) {
      return list.indexOf(this.toString()) !== -1;
    } else {
      boggle._binSearch(list, this.toString()) !== -1;
    }
  };

  IncompleteWord.prototype.trapped = function () {
    var self = this;
    var letterTrapped = function (letter) {
      return letter.trapped.north && 
             letter.trapped.northEast &&
             letter.trapped.east &&
             letter.trapped.southEast &&
             letter.trapped.south &&
             letter.trapped.southWest &&
             letter.trapped.west &&
             letter.trapped.northWest &&
             letter.index !== self.completeWord.length - 1 &&
             letter.index !== 0;
    };
    return letterTrapped(this.first()) && letterTrapped(this.last());
  };

  boggle.IncompleteWord = IncompleteWord;
})(this.boggle);
