/* global describe */
/* global it */
/* global beforeEach */
/* global expect */
/* global boggle */


describe("boggle.findWords", function() {
  "use strict";

  beforeEach(function () {
    this.wordList = [
      "aardvark",
      "aardvarks",
      "bee",
      "bees",
      "monk",
      "monks",
      "zebra"
    ];
  });

  it("finds horizontal words", function () {
    var letterGrid = [
      "m", "o", "n", "k",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid)).toEqual(["monk"]);
  });
 
  it("finds vertical words", function () {
    var letterGrid = [
      "m", " ", " ", " ",
      "o", " ", " ", " ",
      "n", " ", " ", " ",
      "k", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid)).toEqual(["monk"]);
  });

  it("finds diagonal words", function () {
    var letterGrid = [
      "m", " ", " ", " ",
      " ", "o", " ", " ",
      " ", " ", "n", " ",
      " ", " ", " ", "k",
    ];

    expect(boggle.findWords(this.wordList, letterGrid)).toEqual(["monk"]);
  });

  it("finds backwards words", function () {
    var letterGrid = [
      "k", "n", "o", "m",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid)).toEqual(["monk"]);
  });

  it("finds zig zag words", function () {
    var letterGrid = [
      " ", "m", " ", " ",
      " ", " ", "o", " ",
      " ", "n", " ", " ",
      " ", " ", "k", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid)).toEqual(["monk"]);
  });

  it("finds overlapping words", function () {
    var letterGrid = [
      "m", "o", "n", "k",
      " ", " ", " ", "s",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual(["monk", "monks"]);
  });

  it("finds intersecting words", function () {
    var letterGrid = [
      " ", "b", " ", "a",
      "z", "e", "b", "r",
      " ", "e", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual(["bee", "zebra"]);
  });

  it("finds up hook words", function () {
    var letterGrid = [
      " ", " ", " ", "a",
      "z", "e", "b", "r",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual(["zebra"]);
  });

  it("does not find repeated-cell words", function () {
    var letterGrid = [
      "b", "e", "s", " ",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual([]);
  });

  it("finds spiral words", function () {
    var letterGrid = [
      "a", "k", "r", " ",
      "a", "s", "a", " ",
      "r", "d", "v", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual(["aardvark", "aardvarks"]);
  });
 
  it("does not find non-continuous words", function () {
    var letterGrid = [
      "b", " ", "e", "e",
      " ", " ", " ", "s",
      " ", " ", " ", " ",
      " ", " ", " ", " ",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual([]);
  });
});

describe("boggle._chooseLetter", function () {
  "use strict";
  it("chooses a letter based on relative frequency in language", function () {
    var letter1, 
        letter1Count = 0,
        letterNot1Count = 0,
        frequency = 0,
        testCount = 100000,
        testIndex = 0,
        frequencyExpected; 

    // Choose random-ish letter;
    letter1 = boggle._chooseLetter();
        
    // Re-define random to be not at all random
    boggle.random = function (min, max) {
      return ((max - min) / testCount) * testIndex;
    };

    frequencyExpected = boggle._letterFrequencies.en[letter1]; 

    for(testIndex = 0; testIndex < testCount; testIndex++) {
      var letter = boggle._chooseLetter();
      if(letter === letter1) {
        letter1Count++;
      } else {
        letterNot1Count++;
      }
    }

    frequency = letter1Count / (testCount / 100);
    frequency = Math.round(frequency * 100) / 100;
    expect(frequency).toEqual(frequencyExpected);
  });
});
