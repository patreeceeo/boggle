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

  boggle.findWords = function (wordList, letterGrid) {
    var foundWords = [],
        incompleteWords = [],
        self = this,
        columnIndex,
        letters,
        reverseWordList;

    reverseWordList = wordList.map(function (w) {
      return w.split("").reverse().join("");
    });

    letterGrid.forEach(function (letter, letterGridIndex) {
      incompleteWords.forEach(function (word, index) {
        if(self._isAdjacentLetterInGrid(
            self._lastLetter(word), 
            letterGrid,
            letterGridIndex
        )) {

          if(self._isNextLetterInWord(letter, word, wordList)) {
            word = incompleteWords[index] += letter;
          } else if (self._isNextLetterInWord(letter, word, reverseWordList)) {
            word = incompleteWords[index] = letter + word;
          }

          if(~wordList.indexOf(word) && !~foundWords.indexOf(word)) {
            // TODO: just use Array#push and Array#sort
            foundWords = self._insertAlphabetically(word, foundWords);
          }
        }
      });

      columnIndex = 0;
      do {
        letters = self._lettersForColumn(columnIndex, wordList);
        if(~letters.indexOf(letter)) {
          // TODO: store column index along with letter
          // TODO: just use Array#push and Array#sort
          incompleteWords = self._insertAlphabetically(letter, incompleteWords);
        }
        columnIndex++;
      } while(letters > []);
    });

    return foundWords;
  };
})(this.boggle);
