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

  boggle._areAdjacent = function (incompleteWord1, incompleteWord2) {
    var xdif, ydif;
    xdif = Math.abs(
      incompleteWord1.last().x - 
      incompleteWord2.first().x
    );
    ydif = Math.abs(
      incompleteWord1.last().y - 
      incompleteWord2.first().y
    );
    return xdif === 0 && ydif === 1 ||
           xdif === 1 && ydif === 0 ||
           xdif === 1 && ydif === 1;
  };

  boggle._getAdjacency = function (incompleteWord1, incompleteWord2) {
    var xdif, ydif, xdifa, ydifa, north, south, east, west;
    xdif = incompleteWord1.last().x - 
           incompleteWord2.first().x;
    ydif = incompleteWord1.last().y - 
           incompleteWord2.first().y;
    xdifa = Math.abs(xdif);
    ydifa = Math.abs(ydif);

    north = ydif === -1;
    south = ydif === 1;
    east = xdif === 1;
    west = xdif === -1;

    return {
      areAdjacent: xdifa === 0 && ydifa === 1 ||
                   xdifa === 1 && ydifa === 0 ||
                   xdifa === 1 && ydifa === 1,
      direction: north && !east && !west && "north" ||
                 north && east && "northEast" ||
                 east && !north && !south && "east" ||
                 south && east && "southEast" ||
                 south && !east && !west && "south" ||
                 south && west && "southWest" ||
                 west && !north && !south && "west" ||
                 north && west && "northWest"
    };
  };
  
  boggle._oppositeDir = function (dir) {
    switch(dir) {
      case "north":
        return "south";
      case "northEast":
        return "southWest";
      case "east":
        return "west";
      case "southEast":
        return "northWest";
      case "south":
        return "north";
      case "southWest":
        return "northEast";
      case "west":
        return "east";
      case "northWest":
        return "southEast";
    }
  };

  boggle._seedIncompleteWords = function (letterGrid, wordList) {
    var incompleteWords = [];
    this.forEach(letterGrid, function (letter, gridIndex) {
      this.forEach(wordList, function (word) {
        this.forEach(word, function (l, columnIndex) {
          if(letter === l) {
            incompleteWords.push(
              new boggle.IncompleteWord(
                letter, 
                columnIndex,
                word,
                gridIndex % boggle.options.grid.width,
                Math.floor(gridIndex / boggle.options.grid.height)
              )
            );
          }
        });
      });
    });
    return incompleteWords;
  };

  boggle._binSearch = function (list, needle) {
    var index = Math.round(list.length / 2),
        jump = Math.round(list.length / 4);

    while(index > -1 && index < list.length) {
      if(needle == list[index]) {
        return index;
      } else if(needle < list[index]) {
        index = Math.round(index - jump);
      } else {
        index = Math.round(index + jump);
      }
      jump = Math.max(1, jump / 2);
    }
    return -1;
  };

  boggle._unique = function (list) {
    var hash = {},
        retval = [];
    for(var i = 0; i < list.length; i++) {
      hash[list[i]] = list[i];
    }
    for(var key in hash) {
      retval[retval.length] = key;
    }
    return retval;
  };

  boggle._filterWordsOfLetters = function(words, letters) {
    return words.filter(function (word) {
      var memo = true;
      for(var i = 0; i < word.length; i++) {
        memo = memo && letters.indexOf(word[i]) != -1;
        if(!memo) {
          break;
        }
      }
      return memo;
    });
  };

  boggle.findWords = function (wordList, letterGrid) {
    var foundWords = [],
        incompleteWords;

    var uniqueLetters = this._unique(letterGrid);

    console.log("# words:", wordList.length);
    wordList = boggle._filterWordsOfLetters(wordList, uniqueLetters);
    console.log("# words:", wordList.length);
    debugger

    incompleteWords = this._seedIncompleteWords(letterGrid, wordList);

    incompleteWords.sort(function (iw1, iw2) {
      return iw1.first().index - iw2.first().index;
    });

    this.forEach(incompleteWords, function (incompleteWordOuter, indexOuter) {
      if(incompleteWordOuter == null) {
        return;
      }
      this.forEach(incompleteWords, function (incompleteWordInner, indexInner) {
        if(incompleteWordInner == null) {
          return;
        }
        var ajacencyInOut = this._getAdjacency(
          incompleteWordInner, 
          incompleteWordOuter
        );
        var ajacencyOutIn = this._getAdjacency(
          incompleteWordOuter,
          incompleteWordInner 
        );
        if(ajacencyInOut.areAdjacent) {
          if(incompleteWordInner.isSuffix(incompleteWordOuter, wordList)) {
            incompleteWordInner.append(incompleteWordOuter);
            incompleteWords[incompleteWords.length] = incompleteWordInner;
          } else {
            incompleteWordInner.last().trapped[ajacencyInOut.direction] = true;
            incompleteWordOuter.first().trapped[
              this._oppositeDir(ajacencyInOut.direction)
            ] = true;
            if(incompleteWordInner.trapped()) {
              incompleteWords[indexInner] = null;
            }
            if(incompleteWordOuter.trapped()) {
              incompleteWords[indexOuter] = null;
            }
          }
        } else if(ajacencyOutIn.areAdjacent) {
          if (incompleteWordInner.isPrefix(incompleteWordOuter, wordList)) {
            incompleteWordInner.prepend(incompleteWordOuter);
            incompleteWords[incompleteWords.length] = incompleteWordInner;
          } else {
            incompleteWordOuter.last().trapped[ajacencyOutIn.direction] = true;
            incompleteWordInner.first().trapped[
              this._oppositeDir(ajacencyOutIn.direction)
            ] = true;
            if(incompleteWordOuter.trapped()) {
              incompleteWords[indexOuter] = null;
            }
            if(incompleteWordInner.trapped()) {
              incompleteWords[indexInner] = null;
            }
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
