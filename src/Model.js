this.boggle = this.boggle || {};

(function(boggle) {
  "use strict";

  boggle._lastLetter = function (word) {
    return word[word.length - 1];
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

  boggle._insertAlphabetically = function (word, wordList) {
    var index = 0;
    while(word > wordList[index]) {
      index++;
    }
    return this._insert(word, wordList, index); 
  };

  boggle._isNextLetterInWord = function (letter, word, wordList) {
    return !!~this._lettersForColumn(word.length, wordList)
        .indexOf(letter) &&
      ~this._lettersForColumn(word.length - 1, wordList)
        .indexOf(this._lastLetter(word));
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

  boggle._isAdjacentLetterInGrid = function (letter1, letter2, letterGrid) {
    var indexes1, indexes2, isAdjacent;
    indexes1 = this._indexesOf(letter1, letterGrid);
    indexes2 = this._indexesOf(letter2, letterGrid);
    indexes1.forEach(function (i1) {
      indexes2.forEach(function (i2) {
        var xdif, ydif;
        xdif = Math.abs((i1 % 4) - (i2 % 4));
        ydif = Math.abs(Math.floor(i1 / 4) - Math.floor(i2 / 4));
        isAdjacent = isAdjacent ||
          xdif === 0 && ydif === 0 ||
          xdif === 0 && ydif === 1 ||
          xdif === 1 && ydif === 0 ||
          xdif === 1 && ydif === 1;
      });
    });
    return !!isAdjacent;     
  };

  boggle.findWords = function (wordList, letterGrid) {
    var foundWords, incompleteWords, self;
    foundWords = [];
    incompleteWords = [];
    self = this;
    letterGrid.forEach(function (letter) {
      incompleteWords.forEach(function (word, index) {
        if(self._isNextLetterInWord(letter, word, wordList) &&
          self._isAdjacentLetterInGrid(
            letter, 
            self._lastLetter(word), 
            letterGrid
            )
          ) {
          word = incompleteWords[index] += letter;
          if(~wordList.indexOf(word)) {
            foundWords = self._insertAlphabetically(word, foundWords);
          }
        }
      });

      if(~self._lettersForColumn(0, wordList).indexOf(letter)) {
        incompleteWords = self._insertAlphabetically(letter, incompleteWords);
      }
    });

    return foundWords;
  };
})(this.boggle);
