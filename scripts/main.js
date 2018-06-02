(function (window) {
  'use strict';
  var FORM_SELECTOR = '[data-coffee-order="form"]';
  var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
  var SERVER_URL = 'http://coffeerun-v2-rest-api.herokuapp.com/api/coffeeorders';

  function testConnection(remoteDS){
    return new Promise(function (resolve, reject) {
      var testConnection = new Truck('testConnection', remoteDS).printOrders();
      testConnection.done(function() {
        resolve(new Truck('ncc-1701', remoteDS));
      }).fail(function() {
        resolve(new Truck('ncc-1701', new DataStore()));
      });
    });
  }

  var App = window.App;
  var Truck = App.Truck;
  var DataStore = App.DataStore;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var CheckList = App.CheckList;
  var webshim = window.webshim;
  var remoteDS = new RemoteDataStore(SERVER_URL);
  var myTruck;
  testConnection(remoteDS).then(function(truck) {
      console.log(truck);
      myTruck = truck;
      var Validation = App.Validation;
      window.myTruck = myTruck;
      var checkList = new CheckList(CHECKLIST_SELECTOR);
      var formHandler = new FormHandler(FORM_SELECTOR);
      checkList.addClickHandler(myTruck.deliverOrder.bind(myTruck), myTruck.getOrder.bind(myTruck), formHandler.setFormData.bind(formHandler));

      function showOrder(data){
        return myTruck.createOrder.call(myTruck, data)
          .then(function () {
            checkList.addRow.call(checkList, data);
          });
      }

      formHandler.addSubmitHandler(function(data){
        return myTruck.getOrder.call(myTruck, data.emailAddress)
        .then(function (res) {
          console.log(res);
          if(res){
              return myTruck.editOrder.call(myTruck, data).then(function () {
                checkList.editRow.call(checkList, data);
              });
          }else{
            return showOrder(data);
          }
        }, function (err) {
          console.log(err);
          if(err.status === 404){
            return showOrder(data);
          }
        });
      });
      formHandler.showStrengthValue();
      formHandler.addRangeInputChangeHandler();
      formHandler.addInputHandler(Validation.isCompanyEmail);
      myTruck.printOrders(checkList.addRow.bind(checkList));
      webshim.polyfill('forms forms-ext');
      webshim.setOptions('forms', { addValidators: true, lazyCustomMessages: true });
      console.log(formHandler);
  });
})(window);
