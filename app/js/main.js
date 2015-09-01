// SCOPE
// ORGANIZE PUBLIC OBJECTS
'use strict';

(function () {

	 $('.income-box').keyup(function(event){	      
	      // skip for arrow keys
	      if(event.which >= 37 && event.which <= 40){
	          event.preventDefault();
	      }
	      
	      var inputNumber = $(this).val().replace(/,/gi, ''),
	      	  newNumber   = inputNumber.split(/(?=(?:\d{3})+$)/).join(',');
	 
		  $(this).val(newNumber);
	  });


	$('#check-button-house').on('change', '.house:checkbox', function(e) {

		var attr = $(this).attr('checked');
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked');
			
			$('.condo:checkbox')
				.attr('disabled', false)
				.closest('#check-button-condo')
				.removeClass('disabled');
		}

		else {
			$(this).attr('checked','checked');
			$('.condo:checkbox')
				.attr('disabled', true)
				.closest('#check-button-condo')
				.addClass('disabled');
		}

		removeError();
		removeSelectionError();
	});


	$('#check-button-condo').on('change', '.condo:checkbox', function(e) {

		var attr = $(this).attr('checked');
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked');
			
			$('.house:checkbox')
				.attr('disabled', false)
				.closest('#check-button-house')
				.removeClass('disabled');
		}

		else {

			$(this).attr('checked','checked');
			
			$('.house:checkbox')
				.attr('disabled', true)
				.closest('#check-button-house')
				.addClass('disabled');
		}
		
		removeError();
		removeSelectionError();
	});

	$('.income-box').focus(function() {
		 $(this).val('');
		 $('.income-button').removeAttr('disabled');
		 $('.section:first-of-type').after('<br class=\'stop-scroll\'>');
	});

	$('#interface-container').on('click', '.house-select', function(event) {

		$('.condo-select').removeClass('selected-interface');		
		$(this).addClass('selected-interface');
		
		var house 		   = 'house',
			incomeInput    = $('.income-box').val(),
			house_checkbox = $('.house:checkbox'),
			condo_checkbox = $('.condo:checkbox'),
			houseCheck 	   = (house_checkbox.is(':checked')),
			condoCheck 	   = (condo_checkbox.is(':checked')),
			inputEmpty 	   = (incomeInput === '');

		if ((houseCheck === true && condoCheck === false) && (inputEmpty === false)) {
			buildHouseMap();
			console.log('build house map');
		} 

		else if ((houseCheck === false && condoCheck === true) && (inputEmpty === false)) {
			buildHouseMap();
			console.log('build house map');
		}

		else {
			buildKey(house);
			buildDefaultHouse();
			console.log('build default house map');
		}
	});


	$('#interface-container').on('click', '.condo-select', function(event) {
		
		$('.house-select').removeClass('selected-interface')		
		$(this).addClass('selected-interface');

		var condo 		   = 'condo',
			incomeInput    = $('.income-box').val(),
			house_checkbox = $('.house:checkbox'),
			condo_checkbox = $('.condo:checkbox'),
			houseCheck 	   = (house_checkbox.is(':checked')),
			condoCheck 	   = (condo_checkbox.is(':checked')),
			inputEmpty 	   = (incomeInput === '');

		if ((houseCheck === true && condoCheck === false) && (inputEmpty === false)) {
			buildCondoMap();
			console.log('build condo map');
		} 

		else if ((houseCheck === false && condoCheck === true) && (inputEmpty === false)) {
			buildCondoMap();
			console.log('build condo map');
		}

		else {
			buildKey(condo)
			buildDefaultCondo();
			console.log('build default condo map');
		}
	});
	

	// WHEN EVERYTHING IS GOOD TO GO...
	// RUN MAP-BUILDING FUNCTIONS
	$('#button-container').on('click', '.income-button', function() {
		
		var incomeInput = $('.income-box').val();
		
		income = getIncome(incomeInput);

		$houseLayer = L.geoJson($zipData, { onEachFeature: onEachFeature, style: houseStyle });	
		$condoLayer = L.geoJson($zipData, { onEachFeature: onEachFeature, style: condoStyle });

		checkInput(income);

		$('.map-interface').show();

		$('.map-interface-default').hide();

	});

	$('#button-container').on('click', '.reset', function () {

		$('.income-box').val('');
		$('.income-button').removeAttr('disabled');

		$('.house:checkbox').removeAttr('checked');
		$('.condo:checkbox').removeAttr('checked');

		$('.map-interface').hide();

		$('.map-interface-default').show();

		var defaultOption = $('.housing-option option[value=\'default\']');
		
		defaultOption.removeAttr('disabled');

		map.removeLayer($houseLayer)
		map.removeLayer($condoLayer)

		setDefaultMap();
		removeError();

	});


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