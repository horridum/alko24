require('nw.gui').Window.get().showDevTools();

var Knex = require('knex')({
  client : 'sqlite3',
    connection: {
      filename: "./alko24.sqlite"
    }
  });

var Bookshelf = require('bookshelf')(Knex);


var Order = Bookshelf.Model.extend({
  tableName: 'orders',
  items: function() {
    return this.hasMany(Item)
  }
});

var Item = Bookshelf.Model.extend({
  tableName: 'items'
});

new Order().fetchAll().then(function(items){
  console.log(items.toJSON());
});
  
