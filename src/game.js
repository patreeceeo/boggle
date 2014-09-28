!(function (boggle) {
  "use strict";

  var game = {};

  game.state = {};

  game.state.model = new boggle.Model({
    gameState: "ready"
  });
  game.state.letterGrid = boggle.createLetterGrid();
  game.state.guessLetters = new boggle.LetterCollection();
  game.state.correctAnswers = new boggle.WordCollection();
  game.state.correctAnswers.addWords(boggle.findWords(
      boggle.masterWordList.en, 
      game.state.letterGrid
  ));
  game.state.playersAnswers = new boggle.WordCollection();
  game.state.clock = new boggle.Clock();
  // wait for page to load and render
  setTimeout(function () {
    var gameView, 
        letterGridView, 
        typewritterView,
        playersAnswersView,
        correctAnswersView,
        clockView;

    letterGridView = new boggle.views.LetterGrid({
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      letterGrid: game.state.letterGrid
    });

    typewritterView = new boggle.views.Typewritter({
      collection: game.state.guessLetters,
      model: game.state.model
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

    correctAnswersView = new boggle.views.WordList({
      collection: game.state.correctAnswers
    });

    clockView = new boggle.views.Clock({
      model: game.state.clock
    });

    game.state.clock.on("timeup", function () {
      gameView.assignChild(correctAnswersView, "correctAnswers");
      game.state.model.set({gameState: "over"});
    });

    gameView = new boggle.views.Game({
      el: "#game",
      children: {
        letterGrid: letterGridView,
        typewritter: typewritterView,
        playersAnswers: playersAnswersView,
        clock: clockView
      }
    });

    gameView.render();

    game.state.model.set({gameState: "playing"});
  }, 1);
})(this.boggle);
