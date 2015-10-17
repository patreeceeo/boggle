!(function (boggle, _, root) {
  "use strict";

  var game = {};

  game.state = {};
  game.state.model = new boggle.Game();
  game.state.guessLetters = new boggle.LetterCollection();
  game.state.answers = new boggle.WordCollection([], {
    id: "answers"
  });
  game.state.clock = new boggle.Clock();
  game.state.letterGrid = new boggle.LetterCollection([], {
    id: "lettergrid"
  });
  game.state.settings = new boggle.Model({
    id: "settings",
    visualThemeName: "Sun"
  });
  game.state.settings.fetch();
  game.state.settings.save();

  function resetGame () {
    var rawLetterGrid = boggle.createLetterGrid();
    game.state.model.set(game.state.model.constructor.prototype.defaults);
    game.state.letterGrid.reset(boggle.map(rawLetterGrid, function (letter) {
      return {
        letter: letter,
        rotation: _.sample([0, 90, 180, 270]),
        highlight: false
      };
    }));
    game.state.answers.reset();
    game.state.answers.addWords(boggle.findWords(
        boggle.masterWordList.en, 
        rawLetterGrid
    ));

    game.state.model.set({
      maxScore: game.state.answers.reduce(function (maxScore, word) {
        return maxScore + boggle.scoreWord(word); 
      }, 0)
    });
    game.state.clock.reset();
  }

  game.state.model.on("change:gameState", function (model, gameState) {
    switch(gameState) {
      case "paused":
      case "ready":
        game.state.clock.pause();
        var unpause = function (e) {
          if((e.keyCode || e.charCode) === 32) {
            game.state.model.set({gameState: "playing"});
            $(document).unbind("keypress", unpause);
          }
        };
        $(document).keypress(unpause);
        break;
      case "over":
        game.state.clock.finish();
        var playAgain = function (e) {
          if(e.keyCode === 32) {
            resetGame();
            game.state.model.set({gameState: "playing"});
            $(document).unbind("keypress", playAgain);
          }
        };
        $(document).keypress(playAgain);
        break;
      case "wrong":
        game.state.clock.pause();
        break;
      case "playing":
        $("#help").hide();
        game.state.clock.start();
        break;
      default:
        break;
    }
  });


  // wait for page to load and render
  setTimeout(function () {
    var gameView, 
        letterGridView, 
        typewriterView,
        answersView,
        clockView,
        scoreboardView,
        controlsView;

    letterGridView = new boggle.views.LetterGrid({
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      collection: game.state.letterGrid,
    });

    typewriterView = new boggle.views.Typewriter({
      collection: game.state.guessLetters,
      model: game.state.model
    });

    function execCommand (command) {
      switch(command) {
        case "p":
          game.state.model.set({gameState: "paused"});
          break;
        case "buzzer":
          game.state.model.set({gameState: "over"});
          break;
      }
    }

    typewriterView.on("enter", function (word) {
      var wordModel = game.state.answers.findWhere({word: word});

      if(word[0] === ".") {
        execCommand(word.slice(1));
        game.state.guessLetters.reset();
        return;
      }

      if(wordModel != null && wordModel.get("found") !== true) {
        wordModel.set({found: true});
        game.state.model.score(word);
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
      model: game.state.model,
      letterGrid: game.state.letterGrid
    });

    clockView = new boggle.views.Clock({
      model: game.state.clock
    });

    scoreboardView = new boggle.views.Scoreboard({
      model: game.state.model
    });

    controlsView = new boggle.views.Controls({
      model: game.state.settings
    });

    game.state.clock.on("timeup", function () {
      game.state.model.set({gameState: "over"});
    });

    gameView = new boggle.views.Game({
      el: "#game",
      model: game.state.model,
      children: {
        letterGrid: letterGridView,
        typewriter: typewriterView,
        answers: answersView,
        clock: clockView,
        scoreboard: scoreboardView,
        controls: controlsView
      },
      urlEncodeGame: function () {
        var base = window.location.href; 
        var answers = new boggle.WordCollection(game.state.answers.where({found: true}));
        return base + "?" + $.param({
          gs: game.state.model.get("gameState"),
          ls: game.state.letterGrid.map(function (c) {
            return c.get("letter"); 
          }).join(""),
          as: answers.pluck("word"),
        });
      }
    });

    gameView.render();
    game.state.model.set({gameState: "ready"});

    root.addEventListener("beforeunload", function () {
      if(game.state.model.get("gameState") !== "over") {
        game.state.model.save();
        game.state.letterGrid.save();
        game.state.answers.save();
        game.state.clock.save();
        localStorage.setItem("boggle-wordToCubesMap", JSON.stringify(boggle.wordToCubesMap));
      }
    });

    if(localStorage.getItem("boggle-wordToCubesMap") !== null) {
      var loadSavedGame = root.confirm("Restore previous game?");
      if(loadSavedGame) {
        game.state.answers.fetch();
        game.state.clock.fetch();
        game.state.letterGrid.fetch();
        boggle.wordToCubesMap = JSON.parse(localStorage.getItem("boggle-wordToCubesMap"));
        game.state.model.fetch();
      } else {
        resetGame();
      }
    } else {
      resetGame();
    }
  }, 1);
})(this.boggle, this._, this);
