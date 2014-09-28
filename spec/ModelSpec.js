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
      "tartar",
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
      "t", "a", " ", " ",
      "r", "t", " ", " ",
      "a", " ", " ", " ",
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

