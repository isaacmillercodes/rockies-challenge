(function() {

  'use strict';

  angular
    .module('mlbApp.components.main')
    .controller('mainController', mainController);

  mainController.$inject = ['MainService', 'moment'];

  function mainController(MainService, moment) {
    /*jshint validthis: true */
    const vm = this;

    class ResultObject {
      constructor(name, league) {
        this.name = name;
        this.league = league;

        this.totalAllVisits = 0;
        this.avgAllVisitsPerGame = 0;

        this.totalChangesOnly = 0;
        this.avgChangesPerGame = 0;

        this.totalPureVisits = 0;
        this.avgPureVisitsPerGame = 0;
      }
    }

    vm.finalResults = [new ResultObject('Major League Baseball', 'MLB'), new ResultObject('American League', 'AL'), new ResultObject('National League', 'NL')];

    initTeams(vm.finalResults);
    calcSeasonTotals();
    // calcAverages(vm.finalResults);

    //helper functions

    function calcSeasonTotals() {
      for (var i = moment("20160403", "YYYYMMDD"); i < moment("20161003", "YYYYMMDD"); i.add(1, 'days')) {
        let date = i.format().split('-');
        let dayTime = date[2].split('T');

        let month = date[1];

        let day = dayTime[0];

        MainService.getGamesForDay(month, day)
          .then(results => {
            let gamesArray = results.data.data.games.game;

            if (gamesArray) {

              gamesArray.forEach((game, index) => {

                if (game.game_type !== 'R' || game.status !== 'Final') {
                  gamesArray.splice(index, 1);
                }

                let gameDataUrl = gamesArray[index].game_data_directory;

                let gameHomeTeam = gamesArray[index].home_team_name;

                let gameAwayTeam = gamesArray[index].away_team_name;

                MainService.getGameStats(gameDataUrl)
                  .then(gameData => {
                    let game = gameData.data.data.game;

                    let homeTeam;
                    let awayTeam;
                    let homeLeague;
                    let awayLeague;

                    for (var i = 0; i < vm.finalResults.length; i++) {
                      if (vm.finalResults[i].name === gameHomeTeam) {
                        homeTeam = vm.finalResults[i];
                      }
                      if (vm.finalResults[i].name === gameAwayTeam) {
                        awayTeam = vm.finalResults[i];
                      }
                    }

                    if (homeTeam.league === 'AL') {
                      homeLeague = vm.finalResults[1];
                    } else {
                      homeLeague = vm.finalResults[2];
                    }

                    if (awayTeam.league === 'AL') {
                      awayLeague = vm.finalResults[1];
                    } else {
                      awayLeague = vm.finalResults[2];
                    }

                    // console.log(homeTeam.name, homeLeague.name, awayTeam.name, awayLeague.name);

                    game.inning.forEach(inning => {
                      let actionBot = inning.bottom.action;
                      let actionTop = inning.top.action;

                      if (actionBot) {
                        if (!actionBot.length) {
                          translateAction(vm.finalResults[0], awayTeam, awayLeague, actionBot);
                        } else {
                          actionBot.forEach(action => {
                            translateAction(vm.finalResults[0], awayTeam, awayLeague, action);
                          });

                        }
                      }

                      if (actionTop) {
                        if (!actionTop.length) {
                          translateAction(vm.finalResults[0], homeTeam, homeLeague, actionTop);
                        } else {
                          actionTop.forEach(action => {
                            translateAction(vm.finalResults[0], homeTeam, homeLeague, action);
                          });

                        }
                      }


                    });

                  });

              });
            }
          //loop ends for day
          });
      }
    }

    function calcAverages(inputArray) {
      inputArray.forEach(team => {
        if (team.name === 'Major League Baseball') {
          team.avgAllVisitsPerGame = team.totalAllVisits / 4860;
          team.avgChangesPerGame = team.totalChangesOnly / 4860;
          team.avgPureVisitsPerGame = team.totalPureVisits / 4860;
        } else if (team.name === 'National League' || team.name === 'American League') {
          team.avgAllVisitsPerGame = 11;
          team.avgChangesPerGame = 22;
          team.avgPureVisitsPerGame = 33;
        } else {
          team.avgAllVisitsPerGame = 111;
          team.avgChangesPerGame = 222;
          team.avgPureVisitsPerGame = 333;

        }
      });

    }

    function initTeams(inputArray) {
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

            let matchingHomeTeam = inputArray.filter(team => {
              return team.name === game.home_team_name;
            })[0];

            let matchingAwayTeam = inputArray.filter(team => {
              return team.name === game.away_team_name;
            })[0];

            if (!matchingHomeTeam) {
              inputArray.push(new ResultObject(game.home_team_name, teamLeague));
            }

            if (!matchingAwayTeam) {
              inputArray.push(new ResultObject(game.away_team_name, teamLeague));
            }

          });
        }
        return inputArray;
      });

    }

  }

  function translateAction(mlb, team, teamLeague, action) {
    let des = action.des;
    if (des.includes('Pitching Change')) {
      mlb.totalAllVisits++;
      mlb.totalChangesOnly++;
      teamLeague.totalAllVisits++;
      teamLeague.totalChangesOnly++;
      team.totalAllVisits++;
      team.totalChangesOnly++;

    }

    if (des.includes('Coaching visit')) {
      mlb.totalAllVisits++;
      mlb.totalPureVisits++;
      teamLeague.totalAllVisits++;
      teamLeague.totalPureVisits++;
      team.totalAllVisits++;
      team.totalPureVisits++;

    }

  }
})();
