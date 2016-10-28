(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .controller('mainController', mainController);

  mainController.$inject = ['$scope', '$http'];

  function mainController($scope, $http) {
    /*jshint validthis: true */
    this.greeting = 'Hello World!';

  }

})();
