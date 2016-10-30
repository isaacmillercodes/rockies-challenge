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

    let teamsArray = [new ResultObject('Major League Baseball', 'MLB'), new ResultObject('American League', 'AL'), new ResultObject('National League', 'NL')];

    let getTeams = initTeams(teamsArray);
    // let getTotals = calcSeasonTotals(teamsArray);
    // let getAverages = calcAverages(teamsArray);

    // Promise.all([
    //   getTeams,
    //   getTotals,
    //   getAverages
    // ])
    // .then(results => {
    //   // vm.finalResults = teamsArray;
    //   console.log('yaaas');
    //   console.log(results);
    //
    //   // vm.finalResults = results[2];
    // });

    // calcSeasonTotals(teamsArray);
    // calcAverages(teamsArray);



    //helper functions

    let seasonDates = getSeasonDates();

    console.log(seasonDates);

    function getSeasonDates() {
      let seasonDates = [];

      for (var i = moment("20160403", "YYYYMMDD"); i < moment("20161003", "YYYYMMDD"); i.add(1, 'days')) {

        let today = [];

        let date = i.format().split('-');
        let dayTime = date[2].split('T');

        today.push(date[1]);

        today.push(dayTime[0]);

        seasonDates.push(today);
      }
      return seasonDates;
    }

    // function calcSeasonTotals(inputArray) {
    //   return new Promise((resolve, reject) => {
    //
    //     for (var i = moment("20160403", "YYYYMMDD"); i < moment("20161003", "YYYYMMDD"); i.add(1, 'days')) {
    //
    //       let date = i.format().split('-');
    //       let dayTime = date[2].split('T');
    //
    //       let month = date[1];
    //
    //       let day = dayTime[0];
    //
    //       MainService.getGamesForDay(month, day)
    //         .then(results => {
    //           let gamesArray = results.data.data.games.game;
    //
    //           if (gamesArray) {
    //
    //             gamesArray.forEach((game, index) => {
    //
    //               if (game.game_type !== 'R' || game.status !== 'Final') {
    //                 gamesArray.splice(index, 1);
    //               }
    //
    //               let gameDataUrl = gamesArray[index].game_data_directory;
    //
    //               let gameHomeTeam = gamesArray[index].home_team_name;
    //
    //               let gameAwayTeam = gamesArray[index].away_team_name;
    //
    //               MainService.getGameStats(gameDataUrl)
    //                 .then(gameData => {
    //                   let game = gameData.data.data.game;
    //
    //                   let homeTeam;
    //                   let awayTeam;
    //                   let homeLeague;
    //                   let awayLeague;
    //
    //                   for (var i = 0; i < inputArray.length; i++) {
    //                     if (inputArray[i].name === gameHomeTeam) {
    //                       homeTeam = inputArray[i];
    //                     }
    //                     if (inputArray[i].name === gameAwayTeam) {
    //                       awayTeam = inputArray[i];
    //                     }
    //                   }
    //
    //                   if (homeTeam.league === 'AL') {
    //                     homeLeague = inputArray[1];
    //                   } else {
    //                     homeLeague = inputArray[2];
    //                   }
    //
    //                   if (awayTeam.league === 'AL') {
    //                     awayLeague = inputArray[1];
    //                   } else {
    //                     awayLeague = inputArray[2];
    //                   }
    //
    //                   game.inning.forEach(inning => {
    //                     let actionBot = inning.bottom.action;
    //                     let actionTop = inning.top.action;
    //
    //                     if (actionBot) {
    //                       if (!actionBot.length) {
    //                         translateAction(inputArray[0], awayTeam, awayLeague, actionBot);
    //                       } else {
    //                         actionBot.forEach(action => {
    //                           translateAction(inputArray[0], awayTeam, awayLeague, action);
    //                         });
    //
    //                       }
    //                     }
    //
    //                     if (actionTop) {
    //                       if (!actionTop.length) {
    //                         translateAction(inputArray[0], homeTeam, homeLeague, actionTop);
    //                       } else {
    //                         actionTop.forEach(action => {
    //                           translateAction(inputArray[0], homeTeam, homeLeague, action);
    //                         });
    //
    //                       }
    //                     }
    //
    //                   });
    //
    //                 });
    //
    //             });
    //           }
    //
    //         });
    //       }
    //     resolve(inputArray);
    //   });
    //
    // }

    function calcAverages(inputArray) {
      return new Promise((resolve, reject) => {
        inputArray.forEach(team => {
          if (team.name === 'Major League Baseball') {
            team.avgAllVisitsPerGame = team.totalAllVisits / 4860;
            team.avgChangesPerGame = team.totalChangesOnly / 4860;
            team.avgPureVisitsPerGame = team.totalPureVisits / 4860;
          } else if (team.name === 'National League' || team.name === 'American League') {
            team.avgAllVisitsPerGame = team.totalAllVisits / 2430;
            team.avgChangesPerGame = team.totalChangesOnly / 2430;
            team.avgPureVisitsPerGame = team.totalPureVisits / 2430;

          } else {
            team.avgAllVisitsPerGame = team.totalAllVisits / 162;
            team.avgChangesPerGame = team.totalChangesOnly / 162;
            team.avgPureVisitsPerGame = team.totalPureVisits / 162;

          }
        });
        resolve(inputArray);
      });
    }

    function initTeams(inputArray) {
      return new Promise((resolve, reject) => {
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

        });
        resolve(inputArray);
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
