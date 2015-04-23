'use strict';

var jquery = require('jquery');
var bootstrap = require('bootstrap')(jquery);
var gui = require('nw.gui');
gui.Window.get().showDevTools();

var Express = require('express');
var App = new Express();

var Knex = require('knex')({
  client : 'sqlite3',
    connection: {
      filename: './alko24.sqlite'
    }
  });

var Bookshelf = require('bookshelf')(Knex);
App.set('Bookshelf', Bookshelf);
var Item = Bookshelf.Model.extend({
  tableName: 'items'
});

var Order = Bookshelf.Model.extend({
  tableName: 'orders',
  items: function() {
    return this.hasMany(Item);
  }
});

new Order().fetchAll().then(function(items){
  console.log(items.toJSON());
});
  
