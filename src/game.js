!(function (boggle) {
  "use strict";

  var game = {};

  game.state = {};

  game.state.model = new boggle.Model({
    gameState: "ready"
  });
  game.state.letterGrid = boggle.createLetterGrid();
  game.state.guessLetters = new boggle.LetterCollection();
  game.state.answers = new boggle.WordCollection();
  game.state.answers.addWords(boggle.findWords(
      boggle.masterWordList.en, 
      game.state.letterGrid
  ));
  game.state.clock = new boggle.Clock();
  // wait for page to load and render
  setTimeout(function () {
    var gameView, 
        letterGridView, 
        typewritterView,
        answersView,
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
      var wordModel = game.state.answers.findWhere({word: word});
      if(wordModel != null) {
        wordModel.set({found: true});
        game.state.guessLetters.reset();
      } else {
        game.state.model.set({gameState: "wrong"});
        setTimeout(function () {
          game.state.model.set({gameState: "playing"});
          game.state.guessLetters.reset();
        }, 1000);
      }
    });

    answersView = new boggle.views.WordList({
      collection: game.state.answers,
      model: game.state.model
    });

    clockView = new boggle.views.Clock({
      model: game.state.clock
    });

    game.state.clock.on("timeup", function () {
      game.state.model.set({gameState: "over"});
    });

    gameView = new boggle.views.Game({
      el: "#game",
      children: {
        letterGrid: letterGridView,
        typewritter: typewritterView,
        answers: answersView,
        clock: clockView
      }
    });

    gameView.render();

    game.state.model.set({gameState: "playing"});
  }, 1);
})(this.boggle);
