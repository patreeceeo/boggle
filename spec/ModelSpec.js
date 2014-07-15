/* global describe */
/* global it */
/* global beforeEach */
/* global expect */
/* global _ */
/* global Backbone */


describe("Model", function() {
  "use strict";
  var model;

  beforeEach(function() {
    model = new (Backbone.SnakeCaseTransModel.extend({
      url: "http://localhost/bogus",
      defaults: {
        partyTime: true,
        thisIsSnake: false
      }
    }))();
  });

  it("should translate names in camelCase into snake_case", function () {
    expect(_.toCamelCase("this_is_snake")).toEqual("thisIsSnake");
  });

  it("should translate names in snake_case into camelCase", function () {
    expect(_.toSnakeCase("thisIsSnake")).toEqual("this_is_snake");
  });

  it("should translate name in an object using a map function", function () {
    expect(_.mapPropertyNames(_.toCamelCase, {
      this_is_snake: false,
      party_time: true
    })).toEqual({
      thisIsSnake: false,
      partyTime: true
    });
  });

  it("should parse snake_case into camelCase", function () {
    expect(model.parse({
      this_is_snake: false,
      party_time: true
    })).toEqual({
      thisIsSnake: false,
      partyTime: true
    });
  });

  it("should turn camelCase into snake_case when " +
      "communicating w/ server", function () {
    Backbone.sync = function (method, model, options) {
      expect(options.attrs).toEqual({
        this_is_snake: false,
        party_time: true
      });
    };
    model.save();
    model.save({
      thisIsSnake: false
    });
    model.save({
      partyTime: true,
      thisIsSnake: false
    }, {
      patch: true
    });
  
  });
});
