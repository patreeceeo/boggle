this.boggle = this.boggle || {};

(function(boggle) {
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
      return fn.call(boggle, el, i);
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

  boggle._cubes = [
		"ednosw", "aaciot", "acelrs", "ehinps",
		"eefhiy", "elpstu", "acdemp", "gilruw",
		"egkluy", "ahmors", "abilty", "adenvz",
		"bfiorx", "dknotu", "abjmoq", "egintv"
	]; 

  // Find all of the cubeIndexes at which letter1 is adjacent 
  // to letter2, as indicated by a mapping of letters to cubeIndexes
  // where the letter can be found.
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

  // Find a path in a 2D space that does is continuous and does not double-back
  // on itself. The 2D space is represented as a 2D array of numbers, each number 
  // is an index for a space in a boggle field.
  // 
  // Example: 
  //
  // 0  1  2  1
  // 5  3  8  3
  // 9    13
  //
  // There's at least one such path through the above "space" which is 
  // given by 0, 1, 2, 3.
  //
  boggle._findPath = function (paths, usedbits, startCubeIndex) {
    var retval = -1;
    this._debug("startCubeIndex", startCubeIndex);
    this.forEach(paths, function (cubeIndexes, letterIndex) {
      this._debug("remaining path length:", paths.length, "usedbits:", usedbits, 
        "cubeIndexes:", cubeIndexes);
      return this.forEach(cubeIndexes, function (cubeIndex) {
        this._debug("cubeIndex", cubeIndex);
        if(!((1 << cubeIndex) & usedbits) && 
          (startCubeIndex == null || this._adjacencyMap[startCubeIndex][cubeIndex] == 1)) {
          this._debug("choosing cubeIndex:", cubeIndex);
          usedbits |= 1 << cubeIndex;
          if(paths.length === 1) {
            this._debug("eureka!");
            retval = 1;
          } else {
            retval = this._findPath(paths.slice(letterIndex + 1), usedbits, cubeIndex);
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

  boggle.random = function (min, max) {
    return Math.random() * max + min;
  };

  boggle.shuffle = function (array) {
    var retval = [], rindex;
    this.forEach(array, function (item) {
      do {
        rindex = Math.floor(this.random(0, array.length));
      } while(retval[rindex] != null);
      retval[rindex] = item;
    });
    return retval;
  };

  boggle.createLetterGrid = function () {
    var shuffledCubes = this.shuffle(this._cubes);
    return this.map(shuffledCubes, function (cube) {
      return cube[Math.floor(this.random(0, cube.length))];
    });
  };

  boggle.scoreWord = function (word) {
    switch(word.length) {
      case 0:
      case 1:
      case 2:
        return 0;
      case 3:
      case 4:
        return 1;
      case 5:
        return 2;
      case 6:
        return 3;
      case 7:
        return 5;
      default:
        return 11;
    }
  };

})(this.boggle);
