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

  IncompleteWord.prototype.isNextLetter = function (letter, wordList) {
    var word, truncWordList, self;
    self = this;
    word = this.toString() + letter;
    truncWordList = wordList.map(function (w) {
      return w.slice(self.letters[0].index, self.last().index + 2);
    });
    return truncWordList.indexOf(word) != -1;
  };

  IncompleteWord.prototype.isPrevLetter = function (letter, wordList) {
    var word, truncWordList, self;
    self = this;
    word = letter + this.toString();
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

  boggle._isAdjacentLetterInGrid = function (
      letter2, 
      letterGrid, 
      index1
  ) {
    var indexes2, isAdjacent;
    indexes2 = this._indexesOf(letter2, letterGrid);
    this.forEach(indexes2, function (index2) {
      var xdif, ydif, width, height;
      width = boggle.options.grid.width;
      height = boggle.options.grid.height;
      xdif = Math.abs(
        (index1 % width) - 
        (index2 % width)
      );
      ydif = Math.abs(
        Math.floor(index1 / height) - 
        Math.floor(index2 / height)
      );
      isAdjacent = isAdjacent ||
        xdif === 0 && ydif === 0 ||
        xdif === 0 && ydif === 1 ||
        xdif === 1 && ydif === 0 ||
        xdif === 1 && ydif === 1;
    });
    return isAdjacent; 
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

    this.forEach(letterGrid, function (letter, letterGridIndex) {
      this.forEach(incompleteWords, function (incompleteWord) {
        if(this._isAdjacentLetterInGrid(
            incompleteWord.lastLetter(), 
            letterGrid,
            letterGridIndex
        )) {
          if(incompleteWord.isNextLetter(letter, wordList)) {
            incompleteWord.appendLetter(letter);
          }
        } else if(this._isAdjacentLetterInGrid(
            incompleteWord.firstLetter(), 
            letterGrid,
            letterGridIndex
        )) {
          if (incompleteWord.isPrevLetter(letter, wordList)) {
            incompleteWord.prependLetter(letter);
          }
        }

        if(incompleteWord.isInList(wordList) &&
          !incompleteWord.isInList(foundWords)) {
          foundWords.push(incompleteWord.toString());
        }
      });
    });
    return foundWords;
  };
})(this.boggle);
