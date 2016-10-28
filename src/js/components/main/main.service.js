(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .service('MainService', MainService);

  MainService.$inject = ['$http'];

  function MainService($scope, $http) {
    /*jshint validthis: true */
    let baseUrl ='http://gd2.mlb.com/';
    let calendarUrl ='http://gd2.mlb.com/components/game/mlb/year_2016/';

    $http.get(`${calendarUrl}month_05/day_09/miniscoreboard.json`).then(res => {
      console.log(res);
    });
  }

})();
