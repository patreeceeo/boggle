/* global jasmine */
/* global beforeEach */
beforeEach(function () {
  "use strict";
  jasmine.addMatchers({
    toBeAtMost: function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: actual <= expected
          };
        }
      };
    }
  });
});
