'use strict';


// var jquery = require('jquery');
//var bootstrap = require('bootstrap')(jquery);
var gui = require('nw.gui');
var win = gui.Window.get();
global.gui = gui;
global.win = win;



win.showDevTools();

var Knex = require('knex')({
  client : 'sqlite3',
    connection: {
      filename: './alko24.sqlite'
    }
  });

var Bookshelf = require('bookshelf')(Knex);

var Driver = Bookshelf.Model.extend({
  table_name: 'drivers'
});


var Operator = Bookshelf.Model.extend({
  table_name: 'operators'
});


var Item = Bookshelf.Model.extend({
  tableName: 'items',
  orders: function() {
    return this.belongsToMany(Order,'order_id');
  }
});

var Order = Bookshelf.Model.extend({
  tableName: 'orders',
  items: function() {
    return this.belongsToMany(Item,'item_id');
  },
  driver: function() {
    return this.belongsTo(Driver,'driver_id');
  },
  operator: function() {
   return this.belongsTo(Operator,'operator_id'); 
  }

});

var Operators = Bookshelf.Collection.extend({
  model: Operator
});

var Drivers = Bookshelf.Collection.extend({
  model: Driver
});

var Items = Bookshelf.Collection.extend({
  model: Item
});

var Orders = Bookshelf.Collection.extend({
  model: Order
});







function validate_t(form_control){
  //console.log($(form_control));
    if( !$(form_control).text() ) {
          $(form_control).parent().addClass('has-error');
    } else if ($(form_control).text()) {
          $(form_control).parent().removeClass('has-error');
    }
};

function validate_n(form_control){
  //console.log($(form_control));
    if( !$(form_control).val() ) {
          $(form_control).parent().addClass('has-error');
    } else if ($(form_control).val()>0) {
          $(form_control).parent().removeClass('has-error');
    }
};

function deleteitem(id,table) {
  //console.log(table+id);
  var query = Knex(table)
    .del()
    .where({
      id: id
  });
    query.exec();
}


function clearform() {
//  console.log($(form_name));
  $('#price').val('0');
  $('#quantity').val('1');
  $('#title').empty();
  
          var opt = document.createElement('option');
            opt.setAttribute('class','jecEditableOption');
            opt.text = '';
            opt.value= '';


  $('#title').append(opt);


  //console.log($('#title'));
  Items.forge()
    .fetch();
    
  Item.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
          var opt = document.createElement('option');
            opt.value = element.attributes.id;
            opt.text = element.attributes.title;
      
            $('#title').append(opt);

    }); 
    
  }); 


}
function additem_click(){
  // var title = $('#title').val();
  var title = $('#title :selected').text();
  if (title == "") { title = $('#title').jecValue();}
  var id = $('#title :selected').val();
  var quantity = $('#quantity').val();
  var price = $('#price').val();

  new Item({'id': id, 'title': title, 'quantity': quantity, 'purchase_price': price})
    .save({'title': title, 'quantity': quantity, 'purchase_price': price},{patch: true})
    .then(function(model){

    });


  
//  if ($('#checkbox').prop('checked')) {
    $('#additemform').hide(300);
//  }
}

function showstore() {

  var str = ""; //<table><thead><tr><th>Наименование</th><th>Количество</th><th>Цена</th><th>Стоимость</th><th></th></tr></thead><tbody>";
  $('#itemstable').empty();
  Item.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
        str='<tr><td>';
        str+=element.attributes.title;
        str+='</td><td>';
        str+=element.attributes.quantity.toString();
        str+='</td><td>';
        str+=element.attributes.purchase_price.toString();
        str+='</td><td></td><td>';
        str+=(element.attributes.purchase_price*element.attributes.quantity).toString();
        str+='</td><td></td></tr>';
        $('#itemstable').append(str);

    }); 
    
  });
        /*var it = document.getElementById('itemstable');

        //str += '</tbody></table>';
        it.insertAdjacentHTML('afterBegin', str);
        console.log(str);*/
}

Orders.forge()
  .fetch();

new Order().fetchAll().then(function(items){
  //console.log(items.toJSON());
});
  
