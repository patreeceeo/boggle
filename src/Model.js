this.boggle = this.boggle || {};

(function(boggle) {
  "use strict";

  var IncompleteWord;

  IncompleteWord = function (letter, index) {
    this.letters = [{letter: letter, index: index}];
  };

  IncompleteWord.prototype.lastLetter = function () {
    return this.letters[this.letters.length - 1].letter;
  };

  IncompleteWord.prototype.last = function () {
    return this.letters[this.letters.length - 1];
  };

  IncompleteWord.prototype.isNextLetter = function (letter, wordList) {
    var word, truncWordList, self;
    self = this;
    word = this.toWord() + letter;
    truncWordList = wordList.map(function (w) {
      return w.slice(self.letters[0].index, self.last().index + 2);
    });
    return truncWordList.indexOf(word) != -1;
  };

  IncompleteWord.prototype.isPrevLetter = function (letter, wordList) {
    var word, truncWordList, self;
    self = this;
    word = letter + this.toWord();
    truncWordList = wordList.map(function (w) {
      return w.slice(self.letters[0].index - 1, self.last().index + 1);
    });
    return truncWordList.indexOf(word) != -1;
  };

  IncompleteWord.prototype.prependLetter = function (letter) {
    this.letters.unshift({letter: letter, index: this.letters[0].index - 1});
  };

  IncompleteWord.prototype.appendLetter = function (letter) {
    this.letters.push({letter: letter, index: this.last().index + 1});
  };

  IncompleteWord.prototype.toWord = function () {
    return this.letters.map(function (el) {
      return el.letter;
    }).join("");
  };

  IncompleteWord.prototype.isInList = function (list) {
    return list.indexOf(this.toWord()) !== -1;
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
    word.forEach(function (l, index) {
      if(l === letter) {
        indexes.push(index);
      }
    });
    return indexes;
  };

  boggle._isAdjacentLetterInGrid = function (
      letter2, 
      letterGrid, 
      index1
  ) {
    var indexes2, isAdjacent;
    indexes2 = this._indexesOf(letter2, letterGrid);
    indexes2.forEach(function (index2) {
      var xdif, ydif;
      xdif = Math.abs((index1 % 4) - (index2 % 4));
      ydif = Math.abs(Math.floor(index1 / 4) - Math.floor(index2 / 4));
      isAdjacent = isAdjacent ||
        xdif === 0 && ydif === 0 ||
        xdif === 0 && ydif === 1 ||
        xdif === 1 && ydif === 0 ||
        xdif === 1 && ydif === 1;
    });
    return isAdjacent; 
  };

  boggle._seedIncompleteWords = function (incompleteWords, wordList, letter) {
    var letters, columnIndex;
    columnIndex = 0;
    do {
      letters = this._lettersForColumn(columnIndex, wordList);
      if(~letters.indexOf(letter)) {
        incompleteWords.push(new IncompleteWord(letter, columnIndex));
      }
      columnIndex++;
    } while(letters > []);
  };

  boggle.findWords = function (wordList, letterGrid) {
    var foundWords = [],
        incompleteWords = [],
        self = this;

    letterGrid.forEach(function (letter) {
      self._seedIncompleteWords(incompleteWords, wordList, letter);
    });

    letterGrid.forEach(function (letter, letterGridIndex) {
      incompleteWords.forEach(function (incompleteWord) {
        if(self._isAdjacentLetterInGrid(
            incompleteWord.lastLetter(), 
            letterGrid,
            letterGridIndex
        )) {

          debugger
          if(incompleteWord.isNextLetter(letter, wordList)) {
            incompleteWord.appendLetter(letter);
          } else if (incompleteWord.isPrevLetter(letter, wordList)) {
            incompleteWord.prependLetter(letter);
          }

          if(incompleteWord.isInList(wordList) &&
            !incompleteWord.isInList(foundWords)) {
            foundWords.push(incompleteWord.toWord());
          }
        }
      });

    });

    return foundWords;
  };
})(this.boggle);
