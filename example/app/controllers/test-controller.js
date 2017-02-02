(function() {
  'use strict';
  
  angular.module('md-datepicker-testing')
         .controller('TestingController', TestingController);
  
  function TestingController() {
    var vm = this;
    
    vm.model = new Date();
    vm.model2 = new Date();
    vm.model3 = new Date();
  }
  
})();