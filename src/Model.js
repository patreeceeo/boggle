this.boggle = this.boggle || {};

(function(boggle) {
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

  boggle.options = {
    grid: {
      width: 4,
      height: 4
    }
  };

  boggle.forEach = function (array, fn) {
    var i;
    for(i = 0; i < array.length; i++) {
      fn.call(this, array[i], i);
    }
  };

  boggle._lettersForColumn = function (columnIndex, wordList) {
    return wordList.filter(function(word) {
      return word.length > columnIndex;
    }).map(function (word) {
      return word[columnIndex];
    });
  };

  boggle._insert = function (word, wordList, index) {
    var before, after;
    before = wordList.slice(0, index);
    after = wordList.slice(index, wordList.length);
    return before.concat([word], after);
  };

  boggle._indexesOf = function (letter, word) {
    var indexes;
    indexes = [];
    this.forEach(word, function (l, index) {
      if(l === letter) {
        indexes.push(index);
      }
    });
    return indexes;
  };


  boggle._areAdjacent = function (incompleteWord1, incompleteWord2) {
    var xdif, ydif, width, height;
    width = boggle.options.grid.width;
    height = boggle.options.grid.height;
    xdif = Math.abs(
      incompleteWord1.last().x - 
      incompleteWord2.first().x
    );
    ydif = Math.abs(
      incompleteWord1.last().y - 
      incompleteWord2.first().y
    );
    return xdif === 0 && ydif === 0 ||
           xdif === 0 && ydif === 1 ||
           xdif === 1 && ydif === 0 ||
           xdif === 1 && ydif === 1;
  };

  boggle._seedIncompleteWord = function (
      incompleteWords, 
      wordList, 
      letter, 
      gridIndex) {
    var letters, columnIndex;
    columnIndex = 0;
    do {
      letters = this._lettersForColumn(columnIndex, wordList);
      if(~letters.indexOf(letter)) {
        incompleteWords.push(
          new IncompleteWord(
            letter, 
            columnIndex,
            gridIndex % boggle.options.grid.width,
            Math.floor(gridIndex / boggle.options.grid.height)
          )
        );
      }
      columnIndex++;
    } while(letters > []);
  };

  boggle.findWords = function (wordList, letterGrid) {
    var foundWords = [],
        incompleteWords = [];

    this.forEach(letterGrid, function (letter, gridIndex) {
      this._seedIncompleteWord(
        incompleteWords, 
        wordList, 
        letter, 
        gridIndex
      );
    });

    this.forEach(incompleteWords, function (incompleteWordOuter) {
      this.forEach(incompleteWords, function (incompleteWordInner) {
        if(this._areAdjacent(
          incompleteWordInner,
          incompleteWordOuter
        )) {
          if(incompleteWordInner.isSuffix(incompleteWordOuter, wordList)) {
            incompleteWords.push(
              incompleteWordInner.append(incompleteWordOuter));
          }
        } else if(this._areAdjacent(
          incompleteWordOuter,
          incompleteWordInner
        )) {
          if (incompleteWordInner.isPrefix(incompleteWordOuter, wordList)) {
            incompleteWords.push(
              incompleteWordInner.prepend(incompleteWordOuter));
          }
        }

        if(incompleteWordInner.isInList(wordList) &&
          !incompleteWordInner.isInList(foundWords)) {
          foundWords.push(incompleteWordInner.toString());
        }
      });
    });
    return foundWords;
  };
})(this.boggle);
