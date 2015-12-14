var app = app || {};

app.main = (function(){

	var vcMap = angular.module('vcMap', []);

	vcMap.controller('MapController', function MapController($scope, $http, $window){
		
		//setting the slider value to start with
		$scope.year = 1987;
		//watching the slider for changes
		$scope.$watch('year', function(newYear){
			//update scope.year with new year from slider
			$scope.year = newYear;
			//console.log($scope.year);
		});
		
	});

	vcMap.directive('drawMap', function (){
		return {
			//NOT SURE whether I should be restricting by attribute or element??
			restrict: 'A',
			// scope: {
			// 	//here, I'm trying to pass in the current year selected in the year controller
			// 	//but to no avail. I've also tried versions of this with just scope: {year: '=' }
			// 	//or scope: {year: '@'}...nothing has worked
			// 	year: '=year'
			// },
			link: function(scope, element, attr) {
				console.log('link function called');
				//not sure how to pass the value of the year attribute into a variable correctly
				//or if I even need to pass it into a variable??
				console.log('in link function: ' + scope.year);
			
				//drawing the map (using the D3 datamaps plugin)
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
    			//make map responsive once it's been drawn
    			window.addEventListener('resize', function() {
	            	map.resize();
	        	});
	        	
	        	scope.$watch('year', function(newYear){
					//update scope.year with new year from slider
					scope.year = newYear;
					console.log(scope.year);
				
					//grabbing data depending on slider value and processing it
					scope.data = d3.json('js/tri_release_data_three.json', function getData(error, json, year){
				        if(error) return console.warn(error);
				        // console.log('year is ' + year);
				        var releases = [];
				       	var thisYear = [];
				    
				        releases = json;
				        console.log(releases);
				        //pick out the data points from the selected year
				        for(var i = 0; i < releases.length; i++) {

				        	//THIS is where it only works if I manually enter the year
				        	//I want the year to be coming from the current year on the slider, which
				        	//I'm trying to pass into the scope of the directive...but it's not working
				            if(releases[i].year == scope.year) {
				                thisYear.push(releases[i]);
				            }
				        }
				        console.log(thisYear);

				        //function to calculate radii
				        function calculateRadius(n){
					      var r = Math.sqrt(n/Math.PI);
					      return 0.5*r;
					    };
					    //calculate bubble radius
				        for(var j = 0; j < thisYear.length; j++) {
			            	thisYear[j].radius =  calculateRadius(thisYear[j].total_release);
			            	thisYear[j].fillKey = 'bubble';
				        }

				        //sort so that smaller bubbles will be drawn on top
				        thisYear.sort(function(a, b){return b.radius - a.radius });	

				        //draw bubbles
				        map.bubbles(thisYear, {
				        	//append popups to bubbles
				            popupTemplate: function (geo, data) { 
				                    return ['<div class="hoverinfo"><span class="emphasis">Facility: </span>' +  data.facility,
				                    '<br/><span class="emphasis">Address: </span>' +  data.address,
				                    '<br/>' + data.city + ' ' + data.state + ' ' + data.zipcode,
				                    '<br/><span class="emphasis">Release: </span>' +  data.total_release + ' pounds',
				                    '</div>'].join('');
				            }
				        });
					});
				});
			}
		}
	});

	var init = function(){
	        console.log('here goes nothing!');
	    }
	    return {
	        init: init
	};
})();

/* Wait for all elements on the page to load */
window.addEventListener('DOMContentLoaded', app.main.init);