!(function (boggle) {
  "use strict";

  var game = {};

  game.state = {};

  game.state.guessLetters = new boggle.Collection();

  // wait for page to load and render
  setTimeout(function () {
    var gameView, letterGridView, typewritterView;

    letterGridView = new boggle.views.LetterGrid({
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      letterGrid: boggle.createLetterGrid()
    });

    typewritterView = new boggle.views.Typewritter({
      collection: game.state.guessLetters
    });

    gameView = new boggle.views.Game({
      el: "#game-container",
      children: {
        "#LetterGrid-container": letterGridView,
        "#Typewritter-container": typewritterView
      }
    });

    gameView.render();
  }, 1);
})(this.boggle);
