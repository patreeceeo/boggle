
(function(_, Backbone) {
  "use strict";

  _.mixin({
    toSnakeCase: function (name) {
      return name.replace(/([A-Z])/g, function($1) {
          return "_"+$1.toLowerCase();
      });
    },
    toCamelCase: function (name) {
      return name.replace(/(_[a-z])/g, function($1) {
          return $1[1].toUpperCase();
      });
    },
    mapPropertyNames: function (mapFunction, object) {
      return _.object(_.map(_.pairs(object), 
        function (pair) {
          pair[0] = mapFunction(pair[0]);
          return pair;
        }));
    }
  });

  var Model = Backbone.Model.extend({
    parse: function (resp) {
      return _.mapPropertyNames(_.toCamelCase, resp);
    },
    unparse: function (attrs) {
      return _.mapPropertyNames(_.toSnakeCase, attrs);
    },
    sync: function (method, model, options) {
      options.attrs = this.unparse(options.attrs || model.attributes);
      return Backbone.sync.call(this, method, model, options);
    }
  });

  Backbone.SnakeCaseTransModel = Model;
})(this._, this.Backbone);
