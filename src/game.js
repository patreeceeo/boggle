!(function (boggle) {
  "use strict";

  var game = {};

  game.state = {};

  game.state.letterGrid = boggle.createLetterGrid();
  game.state.guessLetters = new boggle.LetterCollection();
  game.state.correctAnswers = new boggle.WordCollection();
  console.profile("findWords");
  console.time("findWords");
  game.state.correctAnswers.addWords(boggle.findWords(
      boggle.masterWordList.en, 
      game.state.letterGrid
  ));
  console.profileEnd("findWords");
  console.timeEnd("findWords");
  game.state.answers = new boggle.WordCollection();
  // wait for page to load and render
  setTimeout(function () {
    var gameView, letterGridView, typewritterView;

    letterGridView = new boggle.views.LetterGrid({
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      letterGrid: game.state.letterGrid
    });

    typewritterView = new boggle.views.Typewritter({
      collection: game.state.guessLetters,
      correctAnswers: game.state.correctAnswers,
      answers: game.state.answers
    });

    gameView = new boggle.views.Game({
      el: "#game-container",
      children: {
        "#LetterGrid-container": letterGridView,
        "#Typewritter-container": typewritterView
      }
    });

    gameView.render();

    game.state.answers.on("add", function () {
      alert("hi");
    });
  }, 1);
})(this.boggle);
