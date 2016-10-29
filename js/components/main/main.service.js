(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .service('MainService', MainService);

  MainService.$inject = ['$http'];

  function MainService($http) {
    /*jshint validthis: true */
    let baseUrl ='http://gd2.mlb.com/';
    let calendarUrl ='http://gd2.mlb.com/components/game/mlb/year_2016/';

    // class ResultObject {
    //   constructor(name, league) {
    //     this.name = name;
    //     this.league = league;
    //     this.totalVisits = 0;
    //     this.totalVisitsOnly = 0;
    //     this.totalChangesOnly = 0;
    //     this.avgVisitsPerGame = 0;
    //     this.avgInningFirstVisit = 0;
    //   }
    // }
    //
    // const resultsArray = [new ResultObject('Major League Baseball', 'MLB'), new ResultObject('American League', 'AL'), new ResultObject('National League', 'NL')];

    this.getGamesForDay = (month, day) => {
      return $http.get(`${calendarUrl}month_${month}/day_${day}/miniscoreboard.json`);
    };

    this.getGameData = (gameDataUrl) => {
      return $http.get(`${baseUrl}${gameDataUrl}/game_events.json`);
    };
  }

})();
