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
  tableName: 'drivers'
});

var Operator = Bookshelf.Model.extend({
  tableName: 'operators'
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
    return this.belongsTo(Driver);
  },
  operator: function() {
   return this.belongsTo(Operator); 
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




function loaditems() {
  var str = ""; 
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
        str+='</td><td><button class="btn btn-danger" onclick="if(confirm(\'Действительно удалить?\')){deleteitem('+element.attributes.id+',\'items\');};loaditems();">Удалить</button></td></tr>';
        $('#itemstable').append(str);

    }); 
    
  });

}


function validate_t(form_control){
   if( !$(form_control).text() ) {
          $(form_control).parent().addClass('has-error');
    } else if ($(form_control).text()) {
          $(form_control).parent().removeClass('has-error');
    } 
};

function validate_n(form_control){
    if( !$(form_control).val() ) {
          $(form_control).parent().addClass('has-error');
    } else if ($(form_control).val()>0) {
          $(form_control).parent().removeClass('has-error');
    }
};

function deleteitem(id,table) {
  var query = Knex(table)
    .del()
    .where({
      id: id
  });
    query.exec();
}

function clearform() {

  $('#price').val('0');
  $('#quantity').val('1');
  $('#title').empty();
  loaditems();

          var opt = document.createElement('option');
            opt.setAttribute('class','jecEditableOption');
            opt.text = '';
            opt.value= '';


  $('#title').append(opt);

/*  Items.forge()
    .fetch();
  */  
  Item.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
          var opt = document.createElement('option');
            opt.value = element.attributes.id;
            opt.text = element.attributes.title;
      
            $('#title').append(opt);

    }); 
    
  }); 
}

function loaddrivers(){
  $('#odriver').empty();
  var str="";
  $('#driverstable').empty();
   Driver.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
       var opt = document.createElement('option');
            opt.value = element.attributes.id;
            opt.text = element.attributes.name;
      
            $('#odriver').append(opt);

      str='<tr><td>';
      str+=element.attributes.name;
      str+='</td><td>';
      str+=element.attributes.share;
      str+='</td><td><button class="btn btn-danger" onclick="if(confirm(\'Действительно удалить?\')){deleteitem('+element.attributes.id+',\'drivers\');};loaddrivers();">Удалить</button></td></tr>';
      $('#driverstable').append(str);
    }); 
  });

}

function addnewpanel(){
  var num = parseInt($('#amount').val()) + 1;
  var div = document.createElement('div');
  div.id = 'buy'+num;
  div.innerHTML='<div class="form-group"><select class="form-control select" id="otitle'+num+'" required = "required"></select></div>'+
  ' <div class="form-group"><input type="number" value="1" class="form-control" id="oquantity'+num+'" min=1  required = "required" onblur="validate_n(\'#oquantity'+num+'\');" /></div>'+
  ' <div class="form-group"><input type="number" value="0" class="form-control" id="oprice'+num+'" min=0  required = "required" onblur="validate_n(\'#oprice'+num+'\');"/></div>'
  //var oarr = Array();
  //var otitle = $("otitle").clone();
    //otitle = JSON.parse(otitle);
    //psdocument.createElement('select');
  //var oprice = document.createElement('input');
  //var oquantity = document.createElement('input');
  $('#buys').append(div);
  
  $('#amount').val(num);

   Item.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
       var opt = document.createElement('option');
       opt.value = element.attributes.id;
       opt.text = element.attributes.title;     
       var cur = '#otitle' + num;
       $(cur).append(opt);
   });
  });
}
function delnewpanel(){
  var num = parseInt($('#amount').val());
  if (num>1){
    var cur='buy'+num;
    $(cur).remove();
    num=num-1;
    $('#amount').val(num);
  }
}
function add_driver(){
  var name = $('#driver_name').val();
  var share = $('#driver_share').val();
  //Knex('drivers').insert({'name':name,'share': share});

 new Driver({'id': null, 'name': name, 'share': share})
    .save({'name': name, 'share': share},{patch: true});
  $('#driver_name').empty();
  $('#driver_share').empty();

}

function loadoperators(){
  $('#ooperator').empty();
  var str="";
  $('#operatorstable').empty();
  Operator.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
       var opt = document.createElement('option');
            opt.value = element.attributes.id;
            opt.text = element.attributes.name;
      
            $('#ooperator').append(opt);

      str='<tr><td>';
      str+=element.attributes.name;
      str+='</td><td>';
      str+=element.attributes.share;
      str+='</td><td><button class="btn btn-danger" onclick="if(confirm(\'Действительно удалить?\')) { deleteitem('+element.attributes.id+',\'operators\'); }; loadoperators(); ">Удалить</button></td></tr>';

      $('#operatorstable').append(str);
    }); 
  });

}

function add_operator(){
  var name = $('#operator_name').val();
  var share = $('#operator_share').val();

  new Operator({'id': null, 'name': name, 'share': share})
    .save({'name': name, 'share': share},{patch: true});
  $('#operator_name').empty();
  $('#operator_share').empty();

}

function add_item(){
  var title = $('#title :selected').text();
  if (title == "") { title = $('#title').jecValue();}
  var id = $('#title :selected').val();
  var quantity = $('#quantity').val();
  var price = $('#price').val();

  new Item({'id': id, 'title': title, 'quantity': quantity, 'purchase_price': price})
    .save({'title': title, 'quantity': quantity, 'purchase_price': price},{patch: true});
  loaditems();
}

function add_order(){
  var releasedate = $('#releasedate').val();
  var odriver = $('#odriver').val();
  var ooperator = $("ooperator").val();


}
function clearorders(){

    Item.fetchAll().then(function(model){
    model.models.forEach(function(element, index){
          var opt = document.createElement('option');
            opt.value = element.attributes.id;
            opt.text = element.attributes.title;
      
            $('#otitle').append(opt);

    }); 
    
  }); 
  
  loaddrivers();
  loadoperators();

}

Orders.forge()
  .fetch();

new Order().fetchAll().then(function(items){
  //console.log(items.toJSON());
});
  
