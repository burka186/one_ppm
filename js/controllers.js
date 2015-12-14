var app = app || {};

app.main = (function(){

	var vcMap = angular.module('vcMap', []);

	vcMap.controller('MapController', function MapController($scope, $window){
		// angular.element($window).on('resize', function (){
		// 	$scope.apply();
		// });
		//setting the slider value to start with
		$scope.year = 1987;
		//watching the slider for changes
		$scope.$watch('year', function(newYear){
			//update scope.year with new year from slider
			$scope.year = newYear;
			console.log($scope.year);
			//grabbing data depending on slider value and processing it
			$scope.data = d3.json('js/tri_release_data_three.json', function(error, json){
		        if(error) return console.warn(error);
		        var releases = [];
		       	var thisYear = [];
		        
		        releases = json;

		        //pick out the data points from the selected year
		        for(var i = 0; i < releases.length; i++) {
		            if(releases[i].year == $scope.year) {
		                thisYear.push(releases[i]);
		            }
		        }

		        //calculate radii
		        function calculateRadius(n){
			      var r = Math.sqrt(n/Math.PI);
			      return 0.5*r;
			    };

		        for(var j = 0; j < thisYear.length; j++) {
	            	thisYear[j].radius =  calculateRadius(thisYear[j].total_release);
	            	thisYear[j].fillKey = 'bubble';
		        }

		        //sort so that smaller bubbles will be drawn on top
		        thisYear.sort(function(a, b){return b.radius - a.radius });	

		        return thisYear;	
			});

		});
		
	});

	vcMap.directive('drawMap', function (){
		return {
			restrict: 'E',
			scope: {
				data: '='
			},
			link: function(scope, element, attr, year) {
				console.log('link function called');
				var map = new Datamap({
			    	element: document.getElementById('map-container'),
			    	scope: 'usa',
			    	responsive: true,
			    	fills: {
			        	defaultFill: 'rgba(211,211,212,0.9)', //any hex, color name or rgb/rgba value
			            fillKey: 'rgba(255,0,0,0.9)',
			            bubble: 'rgba(224,44,30,0.5)'
			        },
			        geographyConfig: {
			            highlightOnHover: false,
			            popupOnHover: false
			        },
			        bubblesConfig: {
			            borderWidth: 1,
			            borderColor: 'rgba(224,44,30,1.0)',
			            popupOnHover: true,
			            fillOpacity: 0.75,
			            highlightOnHover: true,
			            highlightFillColor: 'rgba(250,117,90,1.0)',
			            highlightBorderWidth: 0,
			            highlightFillOpacity: 0.85
			        }
    			});
    			//scope.$watch('data', function(){
    				map.bubbles(thisYear, {
			            popupTemplate: function (geo, data) { 
			                    return ['<div class="hoverinfo"><span class="emphasis">Facility: </span>' +  data.facility,
			                    '<br/><span class="emphasis">Release: </span>' +  data.total_release + ' pounds',
			                    '</div>'].join('');
			            }
			        });
			}
		}
	});

	// var vcMap = angular.module('vcMap', []);

	// vcMap.controller('MapController', function MapController($scope){
	// 	//setting the slider value to start with
	// 	$scope.year = 1987;
	// 	//watching the slider for changes
	// 	$scope.$watch('year', function(newYear){
	// 		$scope.year = newYear;
	// 	});
	// 	//grabbing data depending on slider value and processing it
	// 	$scope.data = d3.json('js/tri_release_data_three.json', function(error, json){
	//         if(error) return console.warn(error);
	//         var releases = [];
	//        	var thisYear = [];
	        
	//         releases = json;

	//         //pick out the data points from the selected year
	//         for(var i = 0; i < releases.length; i++) {
	//             if(releases[i].year == $scope.year) {
	//                 thisYear.push(releases[i]);
	//             }
	//         }

	//         //calculate radii
	//         function calculateRadius(n){
	// 	      var r = Math.sqrt(n/Math.PI);
	// 	      return 0.5*r;
	// 	    };

	//         for(var j = 0; j < thisYear.length; j++) {
 //            	thisYear[j].radius =  calculateRadius(thisYear[j].total_release);
 //            	thisYear[j].fillKey = 'bubble';
	//         }

	//         //sort so that smaller bubbles will be drawn on top
	//         thisYear.sort(function(a, b){return b.radius - a.radius });

	// 	    console.log(thisYear);
	// 	});
	// })
	// .directive('drawMap', function(){
	// 	//think of this like a constructor—gets called when 
	// 	//you want to make a new instance of that directive
	// 	// function link($scope, $element, $attr) {
	    
	// 	// };

	//  //return object with link function and data
	// 	 return {
		 	
	// 	 	restrict: 'E',
	// 	 	scope: { 
	// 	 		data: '=' 
	// 	 	},
	// 	 	link: function(scope, element, attrs) {
	// 	 		var containerid = document.getElementById('map-container');
	// 	 		$scope.$watch('year', function(newYear){
	// 				$scope.year = newYear;
	// 			});
	// 			var data = thisYear;

	// 			var map = new Datamap({
	// 		    	element: containerid,
	// 		    	scope: 'usa',
	// 		    	responsive: true,
	// 		    	fills: {
	// 		        	defaultFill: 'rgba(211,211,212,0.9)', //any hex, color name or rgb/rgba value
	// 		            fillKey: 'rgba(255,0,0,0.9)',
	// 		            bubble: 'rgba(224,44,30,0.5)'
	// 		        },
	// 		        geographyConfig: {
	// 		            highlightOnHover: false,
	// 		            popupOnHover: false
	// 		        },
	// 		        bubblesConfig: {
	// 		            borderWidth: 1,
	// 		            borderColor: 'rgba(224,44,30,1.0)',
	// 		            popupOnHover: true,
	// 		            fillOpacity: 0.75,
	// 		            highlightOnHover: true,
	// 		            highlightFillColor: 'rgba(250,117,90,1.0)',
	// 		            highlightBorderWidth: 0,
	// 		            highlightFillOpacity: 0.85
	// 		        }
	// 		    });
	// 	 	}
	// 	 }

	// });

	var init = function(){
	        window.addEventListener('resize', function() {
	            map.resize();
	        });
	    }
	    return {
	        init: init
	};
})();

/* Wait for all elements on the page to load */
window.addEventListener('DOMContentLoaded', app.main.init);