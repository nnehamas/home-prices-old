'use strict';

(function () {


	 $('.income-box').keyup(function(event){	      
	      // skip for arrow keys
	      if(event.which >= 37 && event.which <= 40){
	          event.preventDefault();
	      }
	      
	      let inputNumber = $(this).val().replace(/,/gi, '');
   
	      let newNumber = inputNumber.split(/(?=(?:\d{3})+$)/).join(',');
	 
		  $(this).val(newNumber);
	  });


	$('#check-button-house').on('change', '.house:checkbox', function(e) {

		let attr = $(this).attr('checked')
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked')
			
			$('.condo:checkbox')
				.attr('disabled', false)
				.closest('#check-button-condo')
				.removeClass('disabled');
		}

		else {
			$(this).attr('checked','checked')
			$('.condo:checkbox')
				.attr('disabled', true)
				.closest('#check-button-condo')
				.addClass('disabled');
		}

		removeError();
		removeSelectionError();
	});


	$('#check-button-condo').on('change', '.condo:checkbox', function(e) {

		let attr = $(this).attr('checked')
		
		if (typeof attr !== typeof undefined && attr !== false) {
			
			$(this).removeAttr('checked')
			
			$('.house:checkbox')
				.attr('disabled', false)
				.closest('#check-button-house')
				.removeClass('disabled');
		}

		else {

			$(this).attr('checked','checked')
			
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

	// WHEN EVERYTHING IS GOOD TO GO...
	// RUN MAP-BUILDING FUNCTIONS
	$('#button-container').on('click', '.income-button', function() {
		
		let incomeInput = $('.income-box').val();
	
		income = getIncome(incomeInput);

		console.log(income)

		checkInput(income);
	
	});

	$('#button-container').on('click', '.reset',function () {

		$('.income-box').val('');

		$('.income-button').removeAttr('disabled');

		$('.house:checkbox').removeAttr('checked');
		$('.condo:checkbox').removeAttr('checked');

		$('#interface-container').hide();

		let defaultOption = $('.housing-option option[value=\'default\']');

		defaultOption.removeAttr('disabled');

		setDefaultMap();
		removeError();

	});

	// MAP INTERFACE DROPDOWN
	$('.housing-option').on('change', function(event) {
		
		let selection = $('.housing-option').val()
		let defaultOption = $('.housing-option option[value=\'default\']');

		defaultOption.attr('disabled', 'disabled')

		if (selection === 'house') {
			buildHouseMap();
		}
		else if (selection === 'condo'){
			buildCondoMap();
		}
		else {
			setDefaultMap();
		}
	});

	// LAUNCH PAD
	var init = function() {
		// buildDefaultMap();
		buildZipList();
		// clearMap();
	}

	// ACTIVATE!	
	$(document).ready(function() {	
		init();
	});

})();