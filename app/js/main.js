/* TO DO
1. Duplicate buildHouseMap() to show
*/

'use strict';

(function () {

	//GLOBALS
	var $buttonContainer = $('#button-container'),
		$errorMessage = $('.error'),
		$hoverBox = $('#hover-box'),
		$incomeBox = $('.income-box'),
		$mapContainer = $('#map-container'),
		$resetButton = $('.reset');

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
		VML: true,
		scrollWheelZoom: false
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


	var getPos = function(event) {
		var w = $('#map-container').width(),
			h = $('#map-container').height(),
			posX = event.pageX + 20,
			posY = event.pageY - 150,
			x = 0,
			y = 0;

		if (posX < w) {

			x = posX - 250;
		}

		else {
			x = posX - ($('#hover-box').outerWidth(true) + 100)
		}

		
		if (posY > h) {
			y = (posY - $('#hover-box').outerHeight(true) - 350)
		}

		else {
			y = posY - 250
		}
			
		$('#hover-box').css({
			'left': x,
			'top': y - 75
		});
	}


	var initHover = function() {
		$hoverBox.show();
		
		$(document).bind('mousemove', getPos);
	}

	var endHover = function() {
		$hoverBox.hide();

		$(document).unbind('mousemove', getPos);
	}


	var onEachFeature = function(feature, layer) {
		
		layer.on({

			mouseover: function(e) {
				var layer = e.target;
				
				layer.setStyle({
					'color': '#666'
				});

				layer.bringToFront();
				
				initHover();

				var zip = parseInt(layer.feature.properties.zipcode),
					city = layer.feature.properties.cities,
					housePriceFourteen = layer.feature.properties.house_price_fourteen,
					housePriceFifteen = layer.feature.properties.house_price_fifteen,
					housePercent = layer.feature.properties.house_pct,
					condoFourteen = layer.feature.properties.condo_price_fourteen,
					condoFifteen = layer.feature.properties.condo_price_fifteen,
					condoPercent = layer.feature.properties.condo_pct;

				$('.zip-code').html(zip)
				$('.city').html(city)

				$('.house-price-fourteen').html(housePriceFourteen)
				$('.house-price-fifteen').html(housePriceFifteen)
				$('.house-percent').html(housePercent)

				$('.condo-price-fourteen').html(condoPriceFourteen)
				$('.condo-price-fifteen').html(condoPriceFifteen)
				$('.condo-percent').html(condoPercent)

			},

			mouseout: function(e) {
				var layer = e.target;
				
				layer.setStyle({
					color: '#fff'
				});
								
				endHover();
			},
			click: function(e) {
				$('#selected-crimevg').removeAttr('id');
				
				// var layer = e.target;
				
				// changeZIP(layer);
			},
			tap: function(e) {}
		});
	};



	$('#check-button-house').on('change', '.house:checkbox', function(e) {

		var attr = $(this).attr('checked')

		console.log('hello')
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked')
			
			$('.condo:checkbox').attr('disabled', false).closest('#check-button-condo').removeClass('disabled');
		}

		else {

			$(this).attr('checked','checked')
			
			$('.condo:checkbox').attr('disabled', true).closest('#check-button-condo').addClass('disabled');
		}
		
		removeError();
		removeSelectionError();
	});


	$('#check-button-condo').on('change', '.condo:checkbox', function(e) {

		var attr = $(this).attr('checked')

		console.log('hello')
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked')
			
			$('.house:checkbox').attr('disabled', false).closest('#check-button-house').removeClass('disabled');
		}

		else {

			$(this).attr('checked','checked')
			
			$('.house:checkbox').attr('disabled', true).closest('#check-button-house').addClass('disabled');
		}
		
		removeError();
		removeSelectionError();
	});


	$buttonContainer.on('click', '.income-button', function() {
		
		checkInput();
	
	});

	$resetButton.click(function ($dataLayer) {

		$incomeBox.val('');

		$('path.leaflet-interactive').css({
			'fill': '#ccc',
			'fillOpacity': 0.3
		});

		$('.income-button').removeAttr('disabled');

		$('.section:first-of-type').after('<br class=\'stop-scroll\'>');

		$('.house:checkbox').removeAttr('checked');

		removeError();

	});


	$incomeBox.focus(function() {
		 
		 $(this).val('');
		 
		 $('.income-button').removeAttr('disabled');

		 $('.section:first-of-type').after('<br class=\'stop-scroll\'>');
	});


	var getNumber = function (num) {

		var income = parseFloat(num.replace(',','') * 3.5);

		$('.income').html('$' + num);
		
		return income;
	};


	var checkInput = function() {

		var incomeInput = $incomeBox.val();

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

		$('.income-button').attr('disabled','disabled');

		
		var incomeInput = $incomeBox.val();

		var income = getNumber(incomeInput);

		d3.csv('../js/libs/data/zips.csv', function(data) {
	  	
			var count = 0;

	  		data.forEach(function(d) {

	  			if (income >= d.house_price) {		
	  				return count++;
	  			}

	  		});

	  		$('.zip-count').html(count);

	  		console.log(count)

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
		        fillColor: getColor(feature.properties.house_price, income),
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

	var setDefaultMap = function (){

		var style = function(feature, layer) {
		    return {
		        fillColor: '#ccc',
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

	}

	var buildZipList = function() {

		d3.json('../js/libs/data/zipcode_test.json', function(data) {

			
			$.each(data, function(i, val) {

				$('#zip-list ul').append('<li class=\'listing\' data-index=' + i + '>' + data[i].zipcode + ' – ' + data[i].city + '</li>')
				 
				
				$('#zip-list').on('click', '.listing', function(event) {
	
					if ( $(this).hasClass('active-listing') ) {
						return false
					}

					var q = $(this).attr('data-index');

					$('.listing .inner').remove();
					
					$('.listing').removeClass('active-listing');
					
					$(this).addClass('active-listing');
					
					$(this).append(
					'<div class="inner">'
					+'<table class=\'school-list\'><tr class= \'table-head\'><th class=\'name\'>School</th><th>2014-15</th><th>2013-14</th><th>2012-13</th></tr></table>'+
					'</div>'
					)


					var schoolData = data[q].school;

					for (var i = 0; i < schoolData.length; i++) {
						
						$('.table-head').after('<tr><td class=\'name\'>' + schoolData[i].name + '</td><td>'+ schoolData[i].grade2012 +'</td><td>' + schoolData[i].grade2011 +'</td><td>' + schoolData[i].grade2010+'</td></tr>')
					};

				});
	  		});
	 
		});

	}


	// LAUNCH PAD
	var init = function() {
		setDefaultMap();
		buildZipList();

	}

	// ACTIVATE!	
	$(document).ready(function() {	
		init();
	});

})();