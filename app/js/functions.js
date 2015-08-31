'use strict';

		var income;
		var $houseLayer = null;
		var $condoLayer = null;
		var $defaultHouseLayer = null;
		var $defaultCondoLayer = null;
	
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

		// ADD CONTROLS
		var control = L.control.zoom({'position' : 'topleft'});
			
		control.addTo(map);

		// BUILD DEFAULT MAP
		function getDefaultHouseColor (d) {


			if (d >= 416325) {
				return '#006d2c';
			}

			else if ((d >= 274250 ) && (d <= 416324)) {
				return '#31a354';
			}

			else if ((d >= 191975 ) && (d <= 274249)) {
				return '#74c476';
			}

			else if ((d >= 1  ) && (d <= 191974)) {
				return '#bae4b3';
			}

			else {
				return '#edf8e9';
			}
		};

		// SET DEFAULT STYLES
		function defaultHouseStyle (features, layer) {
		    return {
		        fillColor: getDefaultHouseColor(features.properties.house_price_fifteen),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		};

		// SET DEFAULT LAYER
		var $defaultHouseLayer = L.geoJson($zipData, { onEachFeature: onEachFeature, style: defaultHouseStyle });

		// ADD DEFAULT LAYER TO MAP
		map.addLayer($defaultHouseLayer)

		function getDefaultCondoColor (d) {


			if (d >= 3102400) {
				return '#eff3ff';
			}

			else if ((d >= 203975 ) && (d <= 3102399)) {
				return '#bdd7e7';
			}

			else if ((d >= 114150 ) && (d <= 203974)) {
				return '#6baed6';
			}

			else if ((d >= 1  ) && (d <= 191974)) {
				return '#3182bd';
			}

			else {
				return '#08519c';
			}
		};

		// SET DEFAULT STYLES
		function defaultCondoStyle (features, layer) {
		    return {
		        fillColor: getDefaultCondoColor(features.properties.condo_price_fifteen),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		};

		// SET DEFAULT LAYER
		var $defaultCondoLayer = L.geoJson($zipData, { onEachFeature: onEachFeature, style: defaultCondoStyle });

		// ADD DEFAULT LAYER TO MAP
	


		function getHouseColor (d) {


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

		function houseStyle (features, layer) {
		    return {
		        fillColor: getHouseColor(features.properties.house_price_fifteen),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		};

		function getCondoColor (d,income) {

			if (income > d) {
				return '#08519c';
			}

			else if (income > (d * 0.75)) {
				return '#3182bd';
			}

			else if (income > (d * 0.50)) {
				return '#6baed6';
			}

			else if (income > (d * 0.25)) {
				return '#bdd7e7';
			}

			else {
				return '#eff3ff';
			}
		};

		function condoStyle (features, layer) {
		    return {
		        fillColor: getCondoColor(features.properties.condo_price_fifteen, income),
		        weight: 2,
		        opacity: 1,
		        color: 'white',
		        dashArray: '3',
		        fillOpacity: 0.7
		    };
		};



	//====================================
	// 				HOVER BOX
	//====================================

	//Set position of hover box on mousemove
	function getPos (event) {
		var w = $('#map-container').width(),
			h = $('#map-container').height(),
			posX = event.pageX + 20,
			posY = event.pageY - 150,
			x = 0,
			y = 0;

		// Horizontal conditions
		if (posX < w) {

			x = posX - 250;
		}

		else {
			x = posX - ($('#hover-box').outerWidth(true) + 100)
		}

		// Vertical conditions
		if (posY > h) {
			y = (posY - $('#hover-box').outerHeight(true) - 325)
		}

		else {
			y = posY - 250
		}
			
		$('#hover-box').css({
			'left': x,
			'top': y - 75
		});
	}

	// Initiate hover
	function initHover () {
		$('#hover-box').show();
		$(document).bind('mousemove', getPos);
	}

	// End hover
	function endHover () {
		$('#hover-box').hide();
		$(document).unbind('mousemove', getPos);
	}


	//====================================
	// 				NUMBERS
	//====================================


	// Get money that can be spent on housing
	function getIncome (num) {
		var income = parseFloat(num.replace(',','') * 3.5);

		$('.income').html('$' + num);
		
		return income;
	};

	// Change number to dollar
	function numberChange (number) {
		if (number === "N/A") {
			return "N/A";
		}
		else {
			return "$" + $.number(number);
		}
	}

	// Format increase/decrease percentage
	function percentChange (number) {

		if ((number < 1) && (number >=0)) {		
			var percent = Math.floor(number * 100);
			if (percent > 0) {
				return "+" + percent + "%"
			}
			else if (number == "N/A") {		
				return "N/A"
			}
			else if (percent == 0) {
				return 0 + "%"
			}
			else {
				return percent + "%"				
			}
		}

		else {
			var percent = Math.floor(number);
			if (percent > 0) {
				return "+" + percent + "%"
			}
			else if (number == "N/A") {
				return "N/A"				
			}
			else if (percent == 0) {
				return 0 + "%"
			}
			else {
				return percent + "%"
			}
		}
	}


	//====================================
	// INCOME INPUT AND HOUSING SELECTION
	// 			ERROR HANDLING
	//====================================

	function flagError () {
		$('.error').slideDown('fast');

		$('.alert').html('<i class=\'fa fa-info-circle\'></i> Error: Please enter a valid number')
	};

	function flagSelectionError () {
		$('.error').slideDown('fast')
		
		$('.alert').html('<i class=\'fa fa-info-circle\'></i> Error: Please choose a housing type')
	}

	function removeError () {
		$('.error').slideUp('fast');
	};

	function removeSelectionError () {
		$('.error').slideUp('fast');
	};


	//====================================
	// 				MAPS
	//====================================


	function buildKey (housing) {

		$('.legend-block').remove();

		if (housing === 'house') {
			var legendColors = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];

			for (var i = 0; i < legendColors.length; i++) {	
				$('.key-default').append('<div class=\'legend-block\' style=\'color:' + legendColors[i] + '\'</div>')
			};
		}

		else {
			var legendColors = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];

			for (var i = 0; i < legendColors.length; i++) {
				
				$('.key-default').append('<div class=\'legend-block\' style=\'color:' + legendColors[i] + '\'</div>')
			};
		}
	}


	// BUILD BASE
	function onEachFeature (feature, layer) {
			
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
					
					condoPriceFourteen = layer.feature.properties.condo_price_fourteen,
					
					condoPriceFifteen = layer.feature.properties.condo_price_fifteen,
					
					condoPercent = layer.feature.properties.condo_pct;


				// Change color of house and condo
				// values by percent

				// Chango condo 2014 color
				if (condoPriceFourteen == 'N/A') {
					$('.condo-price-fourteen').css('color', '#ccc');
				}

				else {
					$('.condo-price-fourteen').css('color', 'black');
				}

				// Chango condo 2015 color			
				if (condoPriceFifteen == 'N/A') {
					$('.condo-price-fifteen').css('color', '#ccc');
				}

				else {
					$('.condo-price-fifteen').css('color', 'black');
				}

				// Change house 2014 color
				if (housePriceFourteen === 'N/A') {
					$('.house-price-fourteen').css('color', '#ccc');
				}

				else {
					$('.house-price-fourteen').css('color', 'black');
				}

				// Change house 2015 color
				if (housePriceFifteen === 'N/A') {
					$('.house-price-fifteen').css('color', '#ccc');
				}

				else {
					$('.house-price-fifteen').css('color', 'black');
				}

				// Change condo percent color
				if (condoPercent > 0) {
					$('.condo-percent').css('color', 'green');
				}

				else if (condoPercent < 0) {
					$('.condo-percent').css('color', 'red');
				}

				else if (condoPercent === 0) {
					$('.condo-percent').css('color', 'black');
				}

				else {
					$('.condo-percent').css('color', '#ccc');
				}

				// Change condo percent color
				if (housePercent > 0) {
					$('.house-percent').css('color', 'green');
				}

				else if (housePercent < 0) {
					$('.house-percent').css('color', 'red');
				}

				else if (housePercent === 0) {
					$('.house-percent').css('color', 'black');
				}

				else {
					$('.house-percent').css('color', '#ccc');
				}

				// Write data from GeoJSON file
				$('.zip-code').html(zip)
				$('.city').html(city)
				$('.house-price-fourteen').html(numberChange(housePriceFourteen))
				$('.house-price-fifteen').html(numberChange(housePriceFifteen))
				$('.house-percent').html(percentChange(housePercent))
				$('.condo-price-fourteen').html(numberChange(condoPriceFourteen))
				$('.condo-price-fifteen').html(numberChange(condoPriceFifteen))
				$('.condo-percent').html(percentChange(condoPercent))
			},

			mouseout: function(e) {
				var layer = e.target;
				
				layer.setStyle({
					color: '#fff'
				});
				
				endHover();

			},

			mousemove: function(e){

			},

			click: function(e) {
				$('#selected-crimevg').removeAttr('id');
				
				// var layer = e.target;
				
				// changeZIP(layer);
			},
			tap: function(e) {}
		});
	};


	function setDefaultMap() {
		buildDefaultHouse();
	}


	function buildDefaultCondo() {
		map.removeLayer($defaultHouseLayer)
		map.addLayer($defaultCondoLayer)

		let condo = 'condo';
		buildKey(condo)		

		$('.housing')
			.html('Condos')
			.css({
				'color': '#08519c',
				'font-weight': 'bold'
			})				
	}


	function buildDefaultHouse() {
		map.removeLayer($defaultHouseLayer)
		map.removeLayer($defaultCondoLayer)
		map.addLayer($defaultHouseLayer)

		let house = 'house';
		buildKey(house);

		$('.housing')
			.html('Single-family houses')
			.css({
				'color': '#006d2c',
				'font-weight': 'bold'
			})					
	}


	// BUILD HOUSE MAP
	function buildHouseMap() {

		var incomeInput = $('.income-box').val();
		var income = getIncome(incomeInput);

		$('.income-button').attr('disabled','disabled');
		$('.house-select').addClass('selected-interface');
		$('.condo-select').removeClass('selected-interface');


		d3.csv('../js/libs/data/zips.csv', function(data) {
	  	
			var count = 0;

	  		data.forEach(function(d) {
	  			if (income >= d.house_price) {		
	  				return count++;
	  			}
	  		});

	  		console.log('Houses:' + count)

	  		$('.income').html("$" + $.number(income));
	  		$('.housing').html('house');
	  		$('.zip-count').html(count);
		});

		$('#interface-container').show();

		$('.key-holder').css('display', 'block');
		
		$('.explainer')
			.css('display', 'block')
			.find('span')

			.each(function() {
				$(this).css({
					'color': '#006d2c',
					'font-weight': 'bold'
				});
			});

		$('.legend-block').remove()

		var legendColors = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];

		for (var i = 0; i < legendColors.length; i++) {
			
			$('.key').append('<div class=\'legend-block\' style=\'color:' + legendColors[i] + '\'</div>')
		};

		$('.label-left').html('Least affordable');
		$('.label-right').html('Most affordable');


		map.removeLayer($defaultHouseLayer)
		map.removeLayer($defaultCondoLayer)
		map.removeLayer($condoLayer)
		map.addLayer($houseLayer)
	};


	// BUILD CONDO MAP
	function buildCondoMap () {

		$('.income-button').attr('disabled','disabled');

		$('.condo-select').addClass('selected-interface');
		$('.house-select').removeClass('selected-interface');

		var incomeInput = $('.income-box').val();
		var income = getIncome(incomeInput);

		d3.csv('../js/libs/data/zips.csv', function(data) {
	  	
			var count = 0;

	  		data.forEach(function(d) {

	  			if (income >= d.condo_price) {		
	  				return count++;
	  			}

	  		});

	  		$('#interface-container').show();

	  		$('.income').html("$" + $.number(income));
	  		$('.housing').html('condo');
	  		$('.zip-count').html(count);

	  		console.log('Condos: ' + count)

		});

		$('.key-holder').css('display', 'block');
		
		$('.explainer')
			.css('display', 'block')
			.find('span')
			.each(function() {
				$(this).css({
					'color': '#08519c',
					'font-weight': 'bold'
				});
			});

		$('.legend-block').remove()

		var legendColors = ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];
		
		for (var i = 0; i < legendColors.length; i++) {
			
			$('.key').append('<div class=\'legend-block\' style=\'border-color:' + legendColors[i] + '\'</div>')
		};

		$('.label-left').html('Least affordable');
		$('.label-right').html('Most affordable');

		map.removeLayer($defaultCondoLayer)
		map.removeLayer($defaultHouseLayer)
		map.removeLayer($houseLayer)
		map.addLayer($condoLayer)

	};




	//====================================
	// 			MAP LIST
	//====================================

	function buildZipList () {
		d3.json('../js/libs/data/zipcode_test.json', function(data) {

			$.each(data, function(i, val) {

				$('#zip-list ul').append('<li class=\'listing\' data-index=' + i + ' data-zipcode=\''+ data[i].zipcode'\'  data-house-fourteen=\''+data[i].house_price_fourteen+'\' data-house-fifteen=\''+data[i].house_price_fifteen+'\' data-house-percent=\''+data[i].house_pct+'\' data-condo-fourteen=\''+data[i].condo_price_fourteen+'\' data-condo-fifteen=\''+data[i].condo_price_fifteen+'\' data-condo-percent=\''+data[i].condo_pct+'\'><span class =\'hed\'>' + data[i].zipcode + ' – ' + data[i].city + '</span></li>')
				 
				
				$('#zip-list').on('click', '.listing', function(event) {

					if ( $(this).hasClass('active-listing') ) {
						return false
					}

					$('.hed').css('text-align', 'center');

					var houseFourteen = $(this).attr('data-house-fourteen'),
						
						houseFifteen = $(this).attr('data-house-fifteen'),

						housePercent = $(this).attr('data-house-percent'),

						condoFourteen = $(this).attr('data-condo-fourteen'),
						
						condoFifteen = $(this).attr('data-condo-fifteen'),

						condoPercent = $(this).attr('data-condo-percent');

					$('.listing .inner').remove();
					
					$('.listing').removeClass('active-listing');
					
					$(this).addClass('active-listing');
					
					$(this).append('<div class="inner">'
					+'<div id=\'prices-container\'>'+
					'<div class=\'price col-sm-12 col-xs-12\'>' +
					'<span class=\'hed\'>Average Home Prices</span>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>2014</span>' +
					'<span class=\'price-num\'>'+ numberChange(houseFourteen) +'</span></div>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>2015</span>' +
					'<span class=\'price-num\'>'+ numberChange(houseFifteen) + '</span></div>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>Pct.</span>' +
					'<span class=\'price-num\'>' + percentChange(housePercent) + '</span></div></div>'+
					'<div class=\'price col-sm-12 col-xs-12\'>' +
					'<span class=\'hed\'>Average Condo Prices</span>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>2014</span>' +
					'<span class=\'price-num\'>'+ numberChange(condoFourteen) + '</span></div>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>2015</span>' +
					'<span class=\'price-num\'>'+ numberChange(houseFifteen) + '</span></div>' +
					'<div class=\'num col-sm-4 col-xs-4\'>' +
					'<span class=\'year\'>Pct.</span>' +
					'<span class=\'price-num\'>'+ percentChange(condoPercent) + '</span></div></div></div>'+'<table class=\'school-list\'><tr class= \'table-head\'><th class=\'name\'>School</th><th>2014-15</th><th>2013-14</th><th>2012-13</th></tr></table>'+'</div>'
					)

					var q = $(this).attr('data-index');
					var schoolData = data[q].school;

					console.log(q)

					for (var i = 0; i < schoolData.length; i++) {
						
						$('.table-head').after('<tr><td class=\'name\'>' + schoolData[i].name + '</td><td>'+ schoolData[i].grade2012 +'</td><td>' + schoolData[i].grade2011 +'</td><td>' + schoolData[i].grade2010+'</td></tr>')
					};
				});
	  		});
		});
	}


	//====================================
	// INCOME INPUT AND HOUSING SELECTION
	//====================================

	function checkInput (income) {

		var incomeInput = $('.income-box').val();

		var house_checkbox = $('.house:checkbox');

		var condo_checkbox = $('.condo:checkbox');

		var inputBoxError = (isNaN(income)) || (incomeInput === '');

		var houseCheck = (house_checkbox.is(':checked'));

		var condoCheck = (condo_checkbox.is(':checked'))

		// ERROR HANDLING
		if (( inputBoxError === false ) && ( houseCheck === true )) {
			buildHouseMap(income);
			removeError();
		}

		else if (( inputBoxError === true ) && ( houseCheck === true )) {
			flagSelectionError();
		}

		else if (( inputBoxError === true ) && ( houseCheck === false )) {
			flagError();
		}

		else if (( inputBoxError === false ) && ( condoCheck === true )) {
			buildCondoMap(income);
			removeError();
		}

		else if (( inputBoxError === true ) && (condoCheck === false)) {
			flagError();
		}

		else if (( inputBoxError === false ) && ( condoCheck === false )) {
			flagSelectionError();
		}
	};


	//====================================
	// 			KEYBOARD SEARCH
	//====================================

	// BUILD SEARCH LIST
	var $items = [];
	
	$('.listing').each(function() {
		var tmp = {};
		tmp.id = $(this).attr('data-index');
		tmp.name = ($items[tmp.id].info.name).toLowerCase();
		$items.push(tmp);
	});

	console.log($items)

	// var $matches = [];
	// var $misses = [];

	// function delegateSearch(kwd) {
	// 	$('.listing.miss').removeClass('miss');
	// 	$('#noMatches').hide();
	// 	$matches = [];
	// 	$misses = [];

	// 	if ((kwd != '') && (kwd.length >= 2)) {
	// 		$.each($items, function(i) {
	// 			if ($items[i].name.indexOf(kwd) !== -1) {
	// 				$matches.push($('#' + $items[i].id));
	// 			} else {
	// 				$misses.push($('#' + $items[i].id));
	// 			}
	// 		});
	// 		$.each($matches, function(i) {
	// 			$($matches[i]).addClass('match');
	// 		});
	// 		$.each($misses, function(i) {
	// 			$($misses[i]).removeClass('match').addClass('miss');
	// 		});
	// 	} else {
	// 		$('.listing').removeClass('miss').addClass('match');
	// 	}

	// }

	// // BIND KEYBOARD
	// $('#srcbox').bind('keyup', function() {
	// 	delegateSearch($(this).val().toLowerCase());
	// 	if ( $('.listing.match').length === 1) {
	// 		$('.listing.match').trigger('click')
	// 	}
		
	// 	if ( $('.listing.match').length === 0) {
	// 		$('#none-message').show()
	// 	} else {
	// 		$('#none-message').hide()
	// 	}
	// });

	// $('#srcbox-button').click(function() {
	// 	$('#srcbox').blur()
	// })

	// $('#reset').click(function() {
	// 	$('#srcbox').val('')
	// 	$('.miss').removeClass('miss')
	// })


	// $(document).keydown(function(e){
	// 	if (e.keyCode === 37) { 
	// 		$('#srcbox').val('')
	// 		$('.miss').removeClass('miss')
	// 	$('.active-listing').prev().trigger('click');
	// 	}
	// 	if (e.keyCode === 39) { 
	// 		$('#srcbox').val('')
	// 		$('.miss').removeClass('miss')
	// 		$('.active-listing').next().trigger('click');
	//   }
	// });







