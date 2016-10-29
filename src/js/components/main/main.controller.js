(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .controller('mainController', mainController);

  mainController.$inject = ['MainService', 'HelperService'];

  function mainController(MainService, HelperService) {
    /*jshint validthis: true */
    const vm = this;

    class ResultObject {
      constructor(name, league) {
        this.name = name;
        this.league = league;

        this.totalAllVisits = 0;
        this.avgAllVisitsPerGame = 0;
        this.avgInningFirstAnyVisit = 0;

        this.totalChangesOnly = 0;
        this.avgChangesPerGame = 0;
        this.avgInningFirstChange = 0;

        this.totalPureVisits = 0;
        this.avgPureVisitsPerGame = 0;
        this.avgInningFirstPureVisit = 0;
      }
    }

    vm.finalResults = [new ResultObject('Major League Baseball', 'MLB'), new ResultObject('American League', 'AL'), new ResultObject('National League', 'NL')];

    initTeams(vm.finalResults);

    //helper functions

    function initTeams(array) {
      MainService.getGamesForDay('10', '02')
      .then(results => {
        let gamesArray = results.data.data.games.game;
        if (gamesArray.length) {
          gamesArray.forEach(game => {

            let leagueInfo = game.league;

            let teamLeague;

            if (leagueInfo[0] === 'A') {
              teamLeague = 'AL';
            } else {
              teamLeague = 'NL';
            }

            if (leagueInfo[1] === 'A') {
              teamLeague = 'AL';
            } else {
              teamLeague = 'NL';
            }

            let matchingHomeTeam = array.filter(team => {
              return team.name === game.home_team_name;
            })[0];

            let matchingAwayTeam = array.filter(team => {
              return team.name === game.away_team_name;
            })[0];

            if (!matchingHomeTeam) {
              array.push(new ResultObject(game.home_team_name, teamLeague));
            }

            if (!matchingAwayTeam) {
              array.push(new ResultObject(game.away_team_name, teamLeague));
            }

          });
        }
        return array;
      });

    }
  }

})();
