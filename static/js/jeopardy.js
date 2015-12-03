(function (angular) {

	'use strict';
	
	angular.module('jeopardy', [])
	.controller('game', ['$scope', '$document', '$timeout', 'video', function ($scope, $document, $timeout, video) {
		
		if(location.href.match(/\?reset/)) {
			if(window.confirm("Reset game?")) {
				localStorage.removeItem("categories");
			}
			window.location = "/";
		}
		
		$scope.apply = function(){
			if(!$scope.$$phase){
				$scope.$apply();
			}
		};
		
		/* Start Categories/Questions */
		if(!localStorage.getItem("categories")){
			$scope.categories = [
				{
					name: "Heroes",
					questions: [
						{
							value: 200,
							question: "He was called \"a man after God's own heart\"",
							answer: "David",
							show: "value"
						},
						{
							value: 400,
							question: "He pushed down the pillars of a temple, burying himself and about 3,000 Philistines alive",
							answer: "Samson",
							show: "value"
						},
						{
							value: 600,
							question: "He asked God for wisdom instead of money, power, or a long life...God gave him all four",
							answer: "Solomon",
							show: "value"
						},
						{
							value: 800,
							question: "They refused to worship an idol, and were thrown into a furnace. However, God protected them, and they did not die",
							answer: "Shadrach, Meshach, Abednego",
							show: "value"
						},
						{
							value: 1000,
							question: "He was the first Christian martyr, being stoned to death after preaching a sermon.",
							answer: "Stephen",
							show: "value"
						}
					]
				},
				{
					name: "Geography",
					questions: [
						{
							value: 200,
							question: "Jesus grew up in this city",
							answer: "Nazareth",
							show: "value"
						},
						{
							value: 400,
							question: "This is where Moses was given the Ten Commandments",
							answer: "Mount Sinai",
							show: "value"
						},
						{
							value: 600,
							question: "These places were destroyed by fire and brimstone, as punishment for their wickedness",
							answer: "Sodom and Gomorrah",
							show: "value"
						},
						{
							value: 800,
							question: "Naaman was the commander of this nation's army",
							answer: "Syria",
							show: "value"
						},
						{
							value: 1000,
							question: "Jesus was baptized here",
							answer: "Jordan River",
							show: "value"
						}
					]
				},
				{
					name: "Finish the Verse",
					questions: [
						{
							value: 200,
							question: "For God so loved the __________...",
							answer: "World (John 3:16)",
							show: "value"
						},
						{
							value: 400,
							question: "I have been __________ with Christ...",
							answer: "Crucified (Galatians 2:20)",
							show: "value"
						},
						{
							value: 600,
							question: "Do not __________ any longer to the pattern of this world",
							answer: "Conform",
							show: "value"
						},
						{
							value: 800,
							question: "Let us __________ on Jesus, the author and perfecter of our faith",
							answer: "Fix our eyes",
							show: "value"
						},
						{
							value: 1000,
							question: "By this all men will know that you are my disciples, __________",
							answer: "If you love one another",
							show: "value"
						}
					]
				},
				{
					name: "Numbers",
					questions: [
						{
							value: 200,
							question: "It took this long for God to create everything",
							answer: "Six Days",
							show: "value"
						},
						{
							value: 400,
							question: "This many people were on board the ark",
							answer: "Eight",
							show: "value"
						},
						{
							value: 600,
							question: "This many prophets of Baal were at Mount Carmel with Elijah",
							answer: "450",
							show: "value"
						},
						{
							value: 800,
							question: "Joseph prophesied this many years of famine in Egypt",
							answer: "Seven",
							show: "value"
						},
						{
							value: 1000,
							question: "Enoch was this old when God took him",
							answer: "365",
							show: "value"
						}
					]
				},
				{
					name: "Which Was 1st?",
					questions: [
						{
							value: 200,
							question: "The Exodus or The Flood?",
							answer: "The Flood",
							show: "value"
						},
						{
							value: 400,
							question: "Ecclesiastes or Esther?",
							answer: "Esther",
							show: "value"
						},
						{
							value: 600,
							question: "Jesus' Baptism or Feeding of the 5000?",
							answer: "Jesus' Baptism",
							show: "value"
						},
						{
							value: 800,
							question: "Beheading of John the Baptist or Jesus Walking on Water?",
							answer: "Jesus Walking on Water",
							show: "value"
						},
						{
							value: 1000,
							question: "The death of Job's children, or the death of Job's servants?",
							answer: "Servants",
							show: "value"
						}
					]
				},
				{
					name: "Miscellaneous",
					questions: [
						{
							value: 200,
							question: "Noah sent these two birds out from the ark first",
							answer: "Raven and Dove",
							show: "value"
						},
						{
							value: 400,
							question: "He had a coat made of camel hair",
							answer: "John the Baptist",
							show: "value"
						},
						{
							value: 600,
							question: "Balaam rode this type of animal",
							answer: "Donkey",
							show: "value"
						},
						{
							value: 800,
							question: "Horeb is this",
							answer: "A mountain",
							show: "value"
						},
						{
							value: 1000,
							question: "This king used a sundial",
							answer: "Hezekiah (Isaiah 38:8)",
							show: "value"
						}
					]
				}
			];
		}
		else {
			window.console.log("Loading existing game from localStorage...");
			$scope.categories = JSON.parse(localStorage.getItem("categories"));
			$scope.apply();
			window.console.log("Game Loaded");
		}
		/* End Categories/Questions */
		
		$scope.uistate = {
			board_loaded: false
		};
		
		$scope.getCategory = function(category){
			return $scope.categories.filter(function(c){
				return c.name === category;
			})[0];
		};
		
		$scope.getQuestion = function(category,question){
			return $scope.getCategory(category).questions.filter(function(q){
				return q.value === question;
			})[0];
		};
		
		$scope.currentQuestionClick = function(){
			if($scope.current_question.show === "question"){
				$scope.current_question.show = "answer";
			}
			else {
				$scope.current_question = null;
			}
			$scope.apply();
			localStorage.setItem("categories", JSON.stringify($scope.categories));
		};
		
		$scope.questionClick = function(category,question){
			var current_state = $scope.getQuestion(category,question).show;
			var new_state = ((current_state === "value") ? "question" : ((current_state === "question") ? "answer" : "none"));
			$scope.getQuestion(category,question).show = new_state;
			if(new_state === "question") {
				$scope.current_question = $scope.getQuestion(category,question);
			}
			$scope.apply();
			localStorage.setItem("categories", JSON.stringify($scope.categories));
		};
		
		/* Run Jeopardy */
		$scope.init = function(){
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
        }]);

})(window.angular);

/*window.onbeforeunload = function() {
	return "Are you sure you wish to reload the page? This will restart the Jeopardy intro!";
};*/