(function (window){
  'use strict';

  var App = window.App || {};
  var $ = window.jQuery;

  function CheckList(selector) {
    if(!selector) {
      throw new Error('No selector provided');
    }

    this.$element = $(selector);
    if(this.$element.length === 0){
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  function Row(coffeeOrder) {
    var $div = $('<div></div>', {
      'data-coffee-order': 'checkbox',
      'class': 'checkbox'
    });

    var $label = $('<label></label>');

    var $checkbox = $('<input></input>', {
      type: 'checkbox',
      value: coffeeOrder.emailAddress
    });

    var description = coffeeOrder.size + ' ';
    if (coffeeOrder.flavor) {
      description += '<span class="'+ coffeeOrder.flavor +'">' + coffeeOrder.flavor + '</span>' + ' ';
    }
    description += coffeeOrder.coffee + ', ';
    description += ' (' + coffeeOrder.emailAddress + ')';
    description += ' [' + coffeeOrder.strength + 'x]';
    if(coffeeOrder.traveltime ||  coffeeOrder.readmind || coffeeOrder.cleancode) {
      description += '. Открыты достижения:';
      if(coffeeOrder.traveltime){
        description += ' путешествие во времени,';
      }
      if(coffeeOrder.readmind){
        description += ' чтение мыслей,';
      }
      if(coffeeOrder.cleancode){
        description += ' код без ошибок,';
      }
      description = description.slice(0, -1);
    }


    $label.append($checkbox);
    $label.append(description);
    $div.append($label);

    this.$element = $div;
  }

  CheckList.prototype.addRow = function (coffeeOrder) {
    this.removeRow(coffeeOrder.emailAddress);
    // Создаем новый экземпляр строки на основе информации о заказе кофе
    var rowElement = new Row(coffeeOrder);
    // Добавляем свойство $element нового экземпляра строки в перечень
    this.$element.append(rowElement.$element);
  };

  CheckList.prototype.removeRow = function (email) {
    this.$element
    .find('[value="' + email + '"]')
    .closest('[data-coffee-order="checkbox"]')
    .remove();
  };

  CheckList.prototype.addClickHandler = function (fn) {
    this.$element.on('click', 'input', function (event) {
      var email = event.target.value;
      this.removeRow(email);
      fn(email);
    }.bind(this));
  };

  App.CheckList = CheckList;
  window.App = App;

})(window);
