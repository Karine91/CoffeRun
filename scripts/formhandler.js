(function(window){
  'use strict';
  var App = window.App || {};
  var $ = window.jQuery;
  var RANGE_INPUT_SELECTOR = '[data-coffee-strength="input"]';
  var RANGE_LABEL_VALUE_SELECTOR = '[data-coffee-strength="value"]';
  var MODAL_ACHIEVEMENT_SELECTOR = '#modalAchievement';
  var ADD_ACHIEVEMENT_SELECTOR = '#achievementYes';
  var NO_ACHIEVEMENT_SELECTOR = '#achievementNo';
  var ACHIEVEMENT_FIELD_SELECTOR = '.achievement';
  function FormHandler(selector){
    if(!selector){
      throw new Error('No selector provided');
    }
    this.$formElement = $(selector);
    this.$rangeStrength = this.$formElement.find(RANGE_INPUT_SELECTOR);
    this.$rangeLabel = this.$formElement.find(RANGE_LABEL_VALUE_SELECTOR);

    this.openAchievement = false;
    if(this.$formElement.length === 0) {
      throw new Error('Could not find element with selector: ' + selector);
    }
  }

  FormHandler.prototype.checkAchievement = function(data){
    if(this.openAchievement) return false;
    if(data.size === 'coffezilla' && data.strength === '100' && data.flavor !== '' && data.email !== ''){
      this.openAchievement = true;
      this.addAchievementHandler();
      this.openModalAchievement();
      return true;
    }
    return false;
  }

  FormHandler.prototype.openModalAchievement = function(){
    $(MODAL_ACHIEVEMENT_SELECTOR).modal('show')
  }

  FormHandler.prototype.hideModalAchievement = function(){
    $(MODAL_ACHIEVEMENT_SELECTOR).modal('hide')
  }

  FormHandler.prototype.addSubmitHandler = function (fn) {
    console.log('Setting submit handler for form');
    var self = this;
    this.$formElement.on('submit', function (event) {
      event.preventDefault();

      var data = {};
      $(this).serializeArray().forEach(function (item) {
        data[item.name] = item.value;
        console.log(item.name + ' is ' + item.value);
      });

      var check = self.checkAchievement(data);
      if(!check) {
        fn(data);
        self.resetForm();
      }
    });
  };

  FormHandler.prototype.highlightStrengthValue = function(value){
    this.$rangeLabel.removeClass();
    if(value < 50){
      this.$rangeLabel.addClass('text-success');
    }
    if(value >= 50 && value < 80){
      this.$rangeLabel.addClass('text-warning');
    }
    if(value >= 80){
      this.$rangeLabel.addClass('text-danger');
    }
  }

  FormHandler.prototype.showStrengthValue = function(){
    this.$rangeLabel.text(this.$rangeStrength[0].value);
    this.highlightStrengthValue(this.$rangeStrength[0].value);
  }

  FormHandler.prototype.addRangeInputChangeHandler = function(){
    this.$rangeStrength.on('change', function (event) {
      this.showStrengthValue();
    }.bind(this));
  }

  FormHandler.prototype.addAchievementHandler = function(){
    $(ADD_ACHIEVEMENT_SELECTOR).on('click', function (event) {
      $(ACHIEVEMENT_FIELD_SELECTOR).addClass('open');
      this.hideModalAchievement();
    }.bind(this));
    $(NO_ACHIEVEMENT_SELECTOR).on('click', function (event) {
      this.resetForm();
    }.bind(this));
  }

  FormHandler.prototype.resetForm = function () {
    $(ACHIEVEMENT_FIELD_SELECTOR).removeClass('open');
    this.$formElement[0].reset();
    this.openAchievement = false;
    this.showStrengthValue();
    this.$formElement[0].elements[0].focus();
  }

  FormHandler.prototype.setFormData = function (data) {
    var $coffeInput = this.$formElement.find('[name ="coffee"]');
    var $emailInput = this.$formElement.find('[name="emailAddress"]');
    var $selectFlavor = this.$formElement.find('[name="flavor"]');
    var $strengthLevel = this.$formElement.find('[name="strength"]');

    console.log(data);
    $coffeInput.val(data.coffee);
    $emailInput.val(data.emailAddress);
    this.$formElement.find('[value="' + data.size +'"]').prop( "checked", true);
    $selectFlavor.val(data.flavor);
    $strengthLevel.val(data.strength);
    this.showStrengthValue();

    if(data.cleancode || data.readmind || data.traveltime){
      $(ACHIEVEMENT_FIELD_SELECTOR).addClass('open');
      this.openAchievement = true;
      if(data.cleancode){
        this.$formElement.find('[name="cleancode"]').prop( "checked" , true);
      }
      if(data.readmind){
        this.$formElement.find('[name="readmind"]').prop( "checked" , true);
      }
      if(data.traveltime){
        this.$formElement.find('[name="traveltime"]').prop( "checked" , true);
      }
    }
  }

  App.FormHandler = FormHandler;
  window.App = App;

})(window)
