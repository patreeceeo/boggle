!(function (boggle) {
  "use strict";

  var game = {};

  game.state = {};

  game.state.letterGrid = boggle.createLetterGrid();
  game.state.guessLetters = new boggle.LetterCollection();
  game.state.correctAnswers = new boggle.WordCollection();
  game.state.correctAnswers.addWords(boggle.findWords(
      boggle.masterWordList.en, 
      game.state.letterGrid
  ));
  game.state.playersAnswers = new boggle.WordCollection();
  // wait for page to load and render
  setTimeout(function () {
    var gameView, 
        letterGridView, 
        typewritterView,
        playersAnswersView;

    letterGridView = new boggle.views.LetterGrid({
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      letterGrid: game.state.letterGrid
    });

    typewritterView = new boggle.views.Typewritter({
      collection: game.state.guessLetters
    });

    typewritterView.on("enter", function (word) {
      if(game.state.correctAnswers.contains(word) && 
        !game.state.playersAnswers.contains(word)
      ) {
        game.state.playersAnswers.addWords([word]);
      }
    });

    playersAnswersView = new boggle.views.WordList({
      collection: game.state.playersAnswers
    });

    gameView = new boggle.views.Game({
      el: "#game",
      children: {
        "letterGrid": letterGridView,
        "typewritter": typewritterView,
        "playersAnswers": playersAnswersView
      }
    });

    gameView.render();
  }, 1);
})(this.boggle);
