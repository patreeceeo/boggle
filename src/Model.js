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
    var index, letters, nextLetters;
    index = this.last().index;
    letters = boggle._lettersForColumn(index, wordList);
    nextLetters = boggle._lettersForColumn(index + 1, wordList);
    return nextLetters.indexOf(letter) !== -1 &&
           letters.indexOf(this.lastLetter()) !== -1;
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

  // boggle._lastLetter = function (word) {
  //   return word[word.length - 1];
  // };

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

  // boggle._insertAlphabetically = function (word, wordList) {
  //   var index = 0;
  //   while(word > wordList[index]) {
  //     index++;
  //   }
  //   return this._insert(word, wordList, index); 
  // };

  // boggle._isNextLetterInWord = function (letter, word, wordList) {
  //   return !!~this._lettersForColumn(word.length, wordList)
  //       .indexOf(letter) &&
  //     ~this._lettersForColumn(word.length - 1, wordList)
  //       .indexOf(word.lastLetter());
  // };

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
      incompleteWords.forEach(function (incompleteWord) {
        if(self._isAdjacentLetterInGrid(
            incompleteWord.lastLetter(), 
            letterGrid,
            letterGridIndex
        )) {

          if(incompleteWord.isNextLetter(letter, wordList)) {
            // word = incompleteWords[index] += letter;
            incompleteWord.appendLetter(letter);
          } else if (incompleteWord.isNextLetter(letter, reverseWordList)) {
            // word = incompleteWords[index] = letter + word;
            incompleteWord.prependLetter(letter);
          }

          if(incompleteWord.isInList(wordList) &&
            !incompleteWord.isInList(foundWords)) {
            // TODO: just use Array#push and Array#sort
            // foundWords = self._insertAlphabetically(word, foundWords);
            foundWords.push(incompleteWord.toWord());
          }
        }
      });

      columnIndex = 0;
      do {
        letters = self._lettersForColumn(columnIndex, wordList);
        if(~letters.indexOf(letter)) {
          // TODO: store column index along with letter
          // TODO: just use Array#push and Array#sort
          // incompleteWords = 
          //    self._insertAlphabetically(letter, incompleteWords);
          incompleteWords.push(new IncompleteWord(letter, columnIndex));
        }
        columnIndex++;
      } while(letters > []);
    });

    return foundWords;
  };
})(this.boggle);
