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
      "b", " ", " ", "a",
      "z", "e", "b", "r",
      " ", " ", "e", " ",
      " ", " ", " ", "s",
    ];

    expect(boggle.findWords(this.wordList, letterGrid))
      .toEqual(["bees", "zebra"]);
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

describe("boggle._lettersForColumn", function () {
  "use strict"; 

  beforeEach(function () {
    this.wordList = [
      "aardvark",
      "bee",
      "bees",
      "monk",
      "monks",
      "zebra"
    ];
  });

  it("finds all letters for a given column in a list of words", function () {
    var letters;

    letters = boggle._lettersForColumn(0, this.wordList);
    expect(letters).toEqual(["a", "b", "b", "m", "m", "z"]);

    letters = boggle._lettersForColumn(3, this.wordList);
    expect(letters).toEqual(["d", "s", "k", "k", "r"]);

    letters = boggle._lettersForColumn(5, this.wordList);
    expect(letters).toEqual(["a"]);
  });
});

describe("boggle._insertAlphabetically", function () {
  "use strict";

  beforeEach(function () {
    this.wordList = [
      "aardvark",
      "bee",
      "bees",
      "monk",
      "monks",
      "zebra"
    ];
  });

  it("inserts words into a word list in alphabetical order", function () {
    var newWordList;

    newWordList = boggle._insertAlphabetically("icecream", this.wordList);      

    expect(newWordList).toEqual([
      "aardvark",
      "bee",
      "bees",
      "icecream",
      "monk",
      "monks",
      "zebra"
    ]);
  });
});
