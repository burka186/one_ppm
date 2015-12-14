var app = app || {};

app.main = (function(){

	
    var releases = [];
    var thisYear = [];
    var selectedYear = 1993;

    //grab the releases from the external JSON file I wrote
    d3.json('js/tri_release_data_three.json', function(error, json){
        if(error) return console.warn(error);
        releases = json;

        for(var i = 0; i < releases.length; i++){
           releases[i].radius =  calculateRadius(releases[i].total_release);
            //releases[i].radius =  d3.scale.sqrt(releases[i].total_release).domain([0, 1e6]).range([0, 15]);
            releases[i].fillKey = 'bubble';
        }
   
        for(i = 0; i < releases.length; i++) {
            if(releases[i].year == selectedYear) {
                thisYear.push(releases[i]);
            }
        }

        thisYear.sort(function(a, b){return b.radius - a.radius });

        console.log(thisYear);
        //map.bubbles(rel87);
        map.bubbles(thisYear, {
            popupTemplate: function (geo, data) { 
                    return ['<div class="hoverinfo"><span class="emphasis">Facility: </span>' +  data.facility,
                    '<br/><span class="emphasis">Release: </span>' +  data.total_release + ' pounds',
                    '</div>'].join('');
            }
        });
       //drawBubbles(releases);
        // map.bubbles([])
    });

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

    function calculateRadius(n){
      var r = Math.sqrt(n/Math.PI);
      return 0.5*r;
    };

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