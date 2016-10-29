(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .controller('mainController', mainController);

  mainController.$inject = ['MainService'];

  function mainController(MainService) {
    /*jshint validthis: true */
    const vm = this;

    class ResultObject {
      constructor(name, league) {
        this.name = name;
        this.league = league;
        this.totalVisits = 0;
        this.totalVisitsOnly = 0;
        this.totalChangesOnly = 0;
        this.avgVisitsPerGame = 0;
        this.avgInningFirstVisit = 0;
      }
    }

    vm.resultsArray = [new ResultObject('Major League Baseball', 'MLB'), new ResultObject('American League', 'AL'), new ResultObject('National League', 'NL')];

    initTeams(vm.resultsArray);



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
