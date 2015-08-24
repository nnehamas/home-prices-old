/* TO DO

1. Duplicate buildHouseMap() to show


*/


'use strict';

(function () {

	//GLOBALS
	var $buttonContainer = $('#button-container'),
		$errorMessage = $('.error'),
		$fullPage = $('#fullpage'),
		// $hoverBox = $('#hover-box'),
		$incomeBox = $('.income-box'),
		// $mapContainer = $('#map-container'),
		$resetButton = $('.reset');

	$fullPage.fullpage({
		anchors: ['income', 'map']
	});

	// MAKE TILE LAYER FOR ZOOMED IN VIEW
	var tiles = new L.StamenTileLayer('toner-lite');

	// BUILD MAP
	var map = new L.Map('map-container', {
		center: new L.LatLng(25.85, -80.33),
		zoom: 10,
		minZoom: 10,
		maxZoom: 16,
		zoomControl: false,
		doubleClickZoom: false,
		VML: true
	}).addLayer(tiles);

	// BUILD AND ADD CONTROLS
	var control = L.control.zoom({'position' : 'topleft'});
		
	control.addTo(map);


	//HELPER FUNCTIONS
	 $incomeBox.keyup(function(event){
	      
	      // skip for arrow keys
	      if(event.which >= 37 && event.which <= 40){
	          event.preventDefault();
	      }

	      var $this = $(this);
	      
	      var num = $this.val().replace(/,/gi, '');
	      
	      var num2 = num.split(/(?=(?:\d{3})+$)/).join(',');
	      
		  $this.val(num2);
	  });


	// var getPos = function (event) {
		
	// 	$hoverBox = $('#hover-box')

	// 	var posX = event.pageX,
	// 		posY = event.pageY,
	// 		$mapContainer = $('#map-container');

	// 	// Handle horizontal conditions
 //        if ( posX > ($mapContainer.width() * .75)) {
 //            $hoverBox.css({
 //                'left': posX / 4,
 //                'top': posY
 //            });
 //        } 

 //        else {
 //            $hoverBox.css({
 //                'left': posX / 4,
 //                'top': posY
 //            });
 //        }


 //        // Handle vertical conditions
 //        if ( posY > ($mapContainer.height() * .50)) {
 //            $hoverBox.css({
 //                'top': posY
 //            });
 //        } 

 //        else {
 //            $hoverBox.css({
 //                'top':  posY
 //            });
 //        }
	// }


	// var initHover = function() {
	// 	$hoverBox.show();
		
	// 	$(document).bind('mousemove', getPos);
	// }

	// var endHover = function() {
	// 	$hoverBox.hide();

	// 	$(document).unbind('mousemove', getPos);
	// }


	var onEachFeature = function(feature, layer) {
		
		layer.on({

			mouseover: function(e) {
				var layer = e.target;
				
				layer.setStyle({
					'opacity': 1,
					'color': '#666'
				});

				layer.bringToFront();
				
				// initHover();

				var zip = parseInt(layer.feature.properties.zipcode);

				var price = parseInt(layer.feature.properties.price);


				$('.zipcode').html(zip + ": " + price);
			},

			mouseout: function(e) {
				var layer = e.target;
				
				layer.setStyle({
					color: '#fff',
					weight: 1
				});
				
				layer.bringToBack();
				
				// endHover();
			},
			click: function(e) {
				$('#selected-crimevg').removeAttr('id');
				
				// var layer = e.target;
				
				// changeZIP(layer);
			},
			tap: function(e) {}
		});
	};



	$('#ck-button').on('change', '.house:checkbox', function(e) {

		var attr = $(this).attr('checked')

		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked')
			$('.condo:checkbox').attr('disabled', false);
		}

		else {
			$(this).attr('checked','checked')
			$('.condo:checkbox').attr('disabled', true);
		}
		
		removeError();
		removeSelectionError();
	});


	$('#ck-button').on('change', '.condo:checkbox', function(e) {

		var attr = $(this).attr('checked')

		if (typeof attr !== typeof undefined && attr !== false) {
			$(this).removeAttr('checked')
		}

		else {
			$(this).attr('checked','checked')
		}
		
		removeError();
		removeSelectionError();
	});



	$buttonContainer.on('click', '.income-button', function() {
		
		checkInput();

		$('.stop-scroll').remove();
	
	});

	$resetButton.click(function ($dataLayer) {

		$incomeBox.val('');

		$('path.leaflet-interactive').hide();

		$('.income-button').removeAttr('disabled');

		$('.section:first-of-type').after('<br class=\'stop-scroll\'>');

		removeError();

	});


	$incomeBox.focus(function() {
		 
		 $(this).val('');
		 
		 $('.income-button').removeAttr('disabled');

		 $('.section:first-of-type').after('<br class=\'stop-scroll\'>');
	});


	var checkInput = function() {

		var incomeInput = $incomeBox.val();

		var getNumber = function (num) {
			
			var income = parseFloat(num.replace(',','') * 3.5);
	
			$('.income').html('$' + num);
			
			return income;
		};

		var income = getNumber(incomeInput);

		var checkbox = $('.house:checkbox');

		
		if ( (isNaN(income) || incomeInput === '')) {

			flagError();
		}

		else if (!(checkbox.is(':checked') )) {
			
			flagSelectionError();
		}


		else {
			removeError();
			buildHouseMap();
		}


	};

	
	var flagError = function() {
		$errorMessage.slideDown('fast');

		$('.alert').html('<i class=\'fa fa-info-circle\'></i> Error: Please enter a valid number')
	};

	var flagSelectionError = function() {
		
		$errorMessage.slideDown('fast')
		
		$('.alert').html('<i class=\'fa fa-info-circle\'></i> Error: Please choose a housing type')
	}


	var removeError = function () {
		$errorMessage.slideUp('fast');
	};

	var removeSelectionError = function () {
		$errorMessage.slideUp('fast');
	};


	var buildHouseMap = function() {

		window.location.replace('#map');

		$('.income-button').attr('disabled','disabled');

		
		var incomeInput = $incomeBox.val();

		var getNumber = function (num) {
			
			var income = parseFloat(num.replace(',','') * 3.5);
			
			$('.income').html("$" + num);
			
			return income;
		};
		
		var income = getNumber(incomeInput);

		d3.csv('../js/libs/data/zips.csv', function(data) {
	  	
			var count = 0;

	  		data.forEach(function(d) {

	  			if (income > d.avg_home_price) {		
	  				count++;
	  			}
	  		});

	  		$('.zip-count').html(count);

		});

		var getColor = function (d) {
	
			if (income > d) {
				return '#006d2c';
			}

			else if (income > (d * 0.75)) {
				return '#31a354';
			}

			else if (income > (d * 0.50)) {
				return '#74c476';
			}

			else if (income > (d * 0.25)) {
				return '#bae4b3';
			}

			else {
				return '#edf8e9';
			}
		};

		var style = function(feature, layer) {
		    return {
		        fillColor: getColor(feature.properties.price, income),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		};

		// GET AND COMPILE DATA
		d3.json('../js/libs/data/zips.geojson', function(data) {
		  	
			var $zip = data;

			var $dataLayer = L.geoJson($zip, { onEachFeature: onEachFeature, style: style });

			$dataLayer.addTo(map);
		});
	};

	var onMapFix = function() {
		$(window).load(function() {
			if (window.location.href.indexOf('#map') > -1) {
				
				$('.stop-scroll').remove()
			}
		});
	}

	// LAUNCH PAD
	var init = function() {
		onMapFix();

	}

	// ACTIVATE!	
	$(document).ready(function() {	
		init();
	});

})();
