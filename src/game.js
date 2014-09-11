!(function (boggle) {
  "use strict";

  // wait for page to load and render
  setTimeout(function () {
    var letterGridView;

    letterGridView = new boggle.views.LetterGrid({
      el: "#game-container",
      width: boggle.options.grid.width,
      height: boggle.options.grid.height,
      letterGrid: boggle.createLetterGrid()
    });

    letterGridView.render();
  }, 1);
})(this.boggle);
