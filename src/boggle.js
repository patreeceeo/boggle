this.boggle = this.boggle || {};

(function(boggle, Backbone) {
  "use strict";  
  boggle.options = {
    grid: {
      width: 4,
      height: 4
    }
  };

  boggle.forEach = function (array, fn) {
    var i, retval;
    for(i = 0; i < array.length; i++) {
      retval = fn.call(this, array[i], i);
      if(retval) {
        return retval;
      }
    }
  };

  boggle.forEachKeyValue = function (object, fn) {
    for(var key in object) {
      if(object.hasOwnProperty(key)) {
        fn.call(this, key, object[key]);
      }
    }
  };

  boggle.map = function (array, fn) {
    var i, retval = [], callback;
    callback = function (el, i) {
      fn.call(boggle, el, i);
    };
    if(typeof array.map === "function") {
      return array.map(callback);
    }
    for(i = 0; i < array.length; i++) {
      retval[retval.length] = fn.call(this, array[i], i);
    }
    return retval;
  };

  boggle._adjacencyMap = [
  /*  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F */
    [ 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 0 */
    [ 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 1 */
    [ 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 2 */
    [ 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],		/* 3 */
    [ 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0 ],		/* 4 */
    [ 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],		/* 5 */
    [ 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0 ],		/* 6 */
    [ 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0 ],		/* 7 */
    [ 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0 ],		/* 8 */
    [ 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0 ],		/* 9 */
    [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1 ],		/* A */
    [ 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1 ],		/* B */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0 ],		/* C */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0 ],		/* D */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1 ],		/* E */
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0 ]		/* F */
  ];

  boggle._findCubeIndexes = function (letter1, letter2, letterMap) {
    var retval = [],
        set1 = letterMap[letter1] || [],
        set2 = letterMap[letter2] || [];

    if(letter2 == null) {
      return set1;
    }

    this.forEach(set1, function (index1) {
      this.forEach(set2, function (index2) {
        if(this._adjacencyMap[index1][index2]) {
          retval[retval.length] = index1;
        }
      });
    });
    return retval;
  };

  boggle._debug = function () {
    // window.console.debug.apply(window.console, arguments);
  };

  boggle._findPath = function (paths, usedbits) {
    var retval = -1;
    this.forEach(paths, function (cubeIndexes, letterIndex) {
      this._debug("remaining path length:", paths.length, "usedbits:", usedbits, 
        "cubeIndexes:", cubeIndexes);
      return this.forEach(cubeIndexes, function (cubeIndex) {
        if((1 << cubeIndex) & usedbits) {
        } else {
          this._debug("choosing cubeIndex:", cubeIndex);
          usedbits |= 1 << cubeIndex;
          if(paths.length === 1) {
            this._debug("eureka!");
            retval = 1;
          } else {
            retval = this._findPath(paths.slice(letterIndex + 1), usedbits);
            if(retval === 1) {
              return 1;
            }
          }
        }
      }) || -1;
    });
    this._debug("backtracking, status:", retval);
    return retval;
  };

  boggle.findWords = function (wordList, letterGrid) {
    var letterMap = {},
        indexedWordList = {},
        foundWords = [];

    boggle.forEach(letterGrid, function (letter, gridIndex) {
      var gridIndexes = letterMap[letter] = letterMap[letter] || [];
      gridIndexes[gridIndexes.length] = gridIndex;
    });

    boggle.forEach(wordList, function (word) {
      var letter = word[0],
          wordListForLetter;

      wordListForLetter = indexedWordList[letter] = indexedWordList[letter] || [];
      if(letterMap[letter] != null) {
        wordListForLetter[wordListForLetter.length] = word;
      }
    });

    this.forEachKeyValue(indexedWordList, function (letter, wordListForLetter) {
      this.forEach(wordListForLetter, function (word) {
        var paths, usedbits = 0;

        this._debug("current word:", word);

        paths = this.map(word, function (letter, letterIndex) {
          var nextLetter = word[letterIndex + 1];
          return this._findCubeIndexes(letter, nextLetter, letterMap);
        });

        this._debug("paths:", paths);

        if(this._findPath(paths, usedbits) === 1) {
          foundWords[foundWords.length] = word;
        }
      });
    });
    return foundWords;
  };

  boggle._letterFrequencies = {
    en: {
      E: 12.02,
      T: 9.10,
      A: 8.12,
      O: 7.68,
      I: 7.31,
      N: 6.95,
      S: 6.28,
      R: 6.02,
      H: 5.92,
      D: 4.32,
      L: 3.98,
      U: 2.88,
      C: 2.71,
      M: 2.61,
      F: 2.30,
      Y: 2.11,
      W: 2.09,
      G: 2.03,
      P: 1.82,
      B: 1.49,
      V: 1.11,
      K: 0.69,
      X: 0.17,
      Q: 0.11,
      J: 0.10,
      Z: 0.07
    }
  };

  boggle._buildLetterBank = function () {
    if(this._letterBank == null) {
      this._letterBank = [];
      var total = 0;
      boggle.forEachKeyValue(this._letterFrequencies.en, function (key, value) {
        this._letterBank.push({letter: key, min: total, max: total + value}); 
        total += value;
      });
    }
  };

  boggle.random = function (min, max) {
    return Math.random() * max + min;
  };

  boggle._chooseLetter = function () {
    boggle._buildLetterBank();
    var max = this._letterBank[this._letterBank.length - 1].max,
        choice,
        letter;
    choice = boggle.random(0, max);
    boggle.forEach(this._letterBank, function (letterInfo) {
      if(letterInfo.min <= choice && letterInfo.max > choice) {
        letter = letterInfo.letter;
      }
    });
    return letter;
  };

  boggle.createLetterGrid = function () {
    var letterGrid = [],
        width = boggle.options.grid.width,
        height = boggle.options.grid.height;
    
    for(var i = 0; i < width * height; i++) {
      letterGrid.push(this._chooseLetter());
    }
    return letterGrid;
  };

  boggle.Model = Backbone.Model;
  boggle.Collection = Backbone.Collection;
  boggle.LetterCollection = boggle.Collection.extend({
    toString: function () {
      return this.reduce(function (memo, model) {
        return memo + model.get("letter");
      }, "");
    }
  });
  boggle.WordCollection = boggle.Collection.extend({
    contains: function (word) {
      return this.filter(function (model) {
        return word.toUpperCase() === model.get("word");
      }, this).length > 0;
    },
    addWords: function (words) {
      this.add(words.map(function (word) {
        return {word: word.toUpperCase()};
      }));
    }
  });

})(this.boggle, this.Backbone);
