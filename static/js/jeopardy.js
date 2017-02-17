(function (angular) {

	'use strict';
	
	angular.module('jeopardy', [])
	.controller('game', ['$scope', '$document', '$timeout', '$http', 'video', function ($scope, $document, $timeout, $http, video) {
		
		if(location.href.match(/\?reset/)) {
			if(window.confirm("Reset game?")) {
				localStorage.removeItem("game_" + window.GAME_ID);
			}
			window.location = window.location.href.split("?")[0];
		}
		
		$scope.apply = function(){
			if(!$scope.$$phase){
				$scope.$apply();
			}
		};
		
		window.$scope = $scope;
		
		$scope.game = {};
		$scope.loadGame = function(){
			return $http.get('/api/v1/board/' + window.GAME_ID + '/').then(function(data){
				$scope.game = data.data;
				$scope.game.double_jeopardy = false;
				$scope.game.questions_answered = 0;
				localStorage.setItem("game_" + window.GAME_ID, JSON.stringify(data.data));
			}, function(data){
				window.console.log("Error loading game:", data);
			});
		}
		
		$scope.isValidCategory = function(category){
			if($scope.game.final_jeopardy) {
				return category.data.final_jeopardy;
			}
			else if($scope.game.double_jeopardy) {
				return category.double_jeopardy;
			}
			else if(!$scope.game.double_jeopardy) {
				return (!category.double_jeopardy && !category.data.final_jeopardy);
			}
		}
		
		$scope.hasFinalJeopardy = function(){
			return $scope.game.categories.find(function(category){ return category.data.final_jeopardy === true; }) || false;
		}
		
		$scope.startFinalJeopardy = function(){
			$scope.game.final_jeopardy = true;
			$scope.final_jeopardy = $scope.hasFinalJeopardy();
			$scope.final_jeopardy.show = "none";
			
			$timeout(function(){
				$scope.final_jeopardy.show = "category";
			}, 2500);
		}
		
		$scope.finalJeopardyClick = function(){
			switch($scope.final_jeopardy.show) {
				case "category":
					$scope.final_jeopardy.show = "question";
					break;
				case "question":
					$scope.final_jeopardy.show = "answer";
					break;
				default:
					$scope.final_jeopardy.show = "none";
					$scope.game.questions_answered++;
					$scope.final_jeopardy = null;
					$scope.checkGameState();
					break;
			}
			$scope.apply();
			localStorage.setItem("game_" + window.GAME_ID, JSON.stringify($scope.game));
		};
		
		$scope.finishGame = function(){
			if(confirm("Thanks for playing! Restart game?")) {
				localStorage.removeItem("game_" + window.GAME_ID);
				window.location.reload();
			}
		}
		
		$scope.staticUrl = function(url) {
			return window.STATIC_URL + url;
		}
		
		$scope.uistate = {
			board_loaded: false
		};
		
		$scope.checkGameState = function() {
			/* Check if all questions are gone */
			if(!$scope.game.double_jeopardy && $scope.game.questions_answered == 30) {
				if($scope.game.categories.count >= 12) {
					$scope.game.double_jeopardy = true;
				}
				else {
					if($scope.hasFinalJeopardy()) {
						$scope.startFinalJeopardy();
					}
					else {
						$scope.finishGame();
					}
				}
			}
			else if($scope.game.double_jeopardy && $scope.game.questions_answered == 60) {
				if($scope.hasFinalJeopardy()) {
					$scope.startFinalJeopardy();
				}
				else {
					$scope.finishGame();
				}
			}
			else if(
				(!$scope.game.double_jeopardy && $scope.game.questions_answered > 30) || 
				($scope.game.double_jeopardy && $scope.game.questions_answered > 60)
			){
				$scope.finishGame();
			}
		}
		
		/* Start Categories/Questions */
		if(!localStorage.getItem("game_" + window.GAME_ID)){
			$scope.loadGame();
		}
		else {
			window.console.log("Loading existing game from localStorage...");
			$scope.game = JSON.parse(localStorage.getItem("game_" + window.GAME_ID));
			$scope.apply();
			$scope.checkGameState();
			window.console.log("Game Loaded");
		}
		/* End Categories/Questions */
		
		$scope.isDailyDouble = function(question) {
			if($scope.game.daily_doubles.find(function(daily_double){ return daily_double == question.id })) {
				return true;
			}
			
			return false;
		}
		
		$scope.questionValue = function(question) {
			var multiplier = 1;
			if($scope.game.double_jeopardy) multiplier = 2;
			return '$' + (question.placement*200*multiplier);
		}
		
		$scope.currentQuestionClick = function(){
			switch($scope.current_question.show) {
				case "daily-double":
					$scope.current_question.show = "question";
					break;
				case "question":
					$scope.current_question.show = "answer";
					break;
				default:
					$scope.current_question.show = "none";
					$scope.game.questions_answered++;
					$scope.current_question = null;
					$scope.checkGameState();
					break;
			}
			$scope.apply();
			localStorage.setItem("game_" + window.GAME_ID, JSON.stringify($scope.game));
		};
		
		$scope.questionClick = function(question){
			switch(question.show) {
				case undefined:
					question.show = ($scope.isDailyDouble(question) ? "daily-double" : "question");
					$scope.current_question = question;
					break;
				case "question":
					question.show = "answer"
					break;
				case "answer":
					question.show = "none";
					break;
			}
			$scope.apply();
			localStorage.setItem("game_" + window.GAME_ID, JSON.stringify($scope.game));
		};
		
		/* Run Jeopardy */
		$scope.init = function(){
			
			if(localStorage.getItem("game_" + window.GAME_ID)) {
				$scope.uistate.board_loaded = true;
				$scope.apply();
				video.quiet(0);
			}
			
			/* Start video intro stuff */
			video.play();
			
			// Quiet audio
			$timeout(function(){
				video.quiet(0.9);
			}, 9000);
			
			// Load board
			$timeout(function(){
				video.quiet(0.9);
				$scope.uistate.board_loaded = true;
				$scope.apply();
			}, 9500);
			/* End video intro stuff */
		};
		$document.ready(function(){
			$scope.init();
		});
	}])
	.factory('video', ['$document', function($document) {

            var VIDEO_OBJECT = $document.find("video")[0];

            var play = function() {
                VIDEO_OBJECT.play();
            };
            
            var mute = function() {
                VIDEO_OBJECT.muted = true;
            };
            
            var quiet = function(vol) {
	            VIDEO_OBJECT.volume = vol;
				if(vol > 0) { setTimeout(function(){ quiet(parseFloat(vol-0.05).toFixed(2)); }, 500); }
            };

            return {
                play: function() {
                    play();
                },
                mute: function() {
                    mute();
                },
                quiet: function(vol) {
                    quiet(vol);
                },
            };
        }])
        .directive('gameBoard', function() {
		    return {
		        restrict: 'E',
		        templateUrl: function(){ return window.STATIC_URL + 'templates/game-board.html' }
		    }
		})
		.directive('finalJeopardy', function() {
		    return {
		        restrict: 'E',
		        templateUrl: function(){ return window.STATIC_URL + 'templates/final-jeopardy.html' }
		    }
		});

})(window.angular);