$(document).ready(function() {

	var dateOptions = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
	}

	// global settings for AJAX calls
	$.ajaxSetup({
		cache:false,
		type:"POST",
		url:"api.php",
		contentType:"application/json",
		// error:function(err) {
		// 	console.log(err);
		// 	new Noty({
		// 		type: 'error',
		// 		theme: 'relax',
		// 		text: 'Something wrong with the server response',
		// 		timeout: 2000,
		// 	}).show();
		// }
	});

	var listParams = {
		kind: ''
	};

	var currentList = [];

	// list all the notes
	var list = function() {
		var listNode = $('#list');

		var json = { function: 'get', data: listParams };

		$.ajax({ data: JSON.stringify(json) })
		.done(function(data) {
			currentList = data;

			listNode.empty();

			try {
				var html = `<table class="table is-striped is-fullwidth"><thead><tr><th>Date</th><th>Duration</th><th>Style</th><th>Instructor</th><th></th></tr></thead><tbody>`;

				$.each(data, function(key, val) {
					var date = new Date(val.date)

					html = html + `<tr class="${val.full === "1" ? 'class-full' : ''}"><td class="list-date">${date.toLocaleTimeString("en-us", dateOptions)}</td><td>${val.duration} minutes</td><td>${val.style}</td><td>${val.instructor}</td><td class="list-actions">${val.full === "0" ? `<button data-index="${key}" class="button is-info reserve-button">Make Reservation</button>` : 'Class is full'}</td></tr>`;
				});

				html = html + "</tbody></table>";

				listNode.html(html);
			} catch(error) {
				console.log(error);
			}
		});

	};

	var start = function() {
		showList()
	}

	var showList = function() {
		$('section').hide();

		list();

		$('#list-section').fadeIn(500);
	}

	var showReserve = function(ev) {
		ev.preventDefault();

		$('#list-section').hide();

		$('#reserve-section').fadeIn(500);

		$('input', '#reserve-form').val('');

		var val = currentList[ parseInt($(this).data('index')) ];

		var date = new Date(val.date)

		var html = `<strong>Date:</strong> ${date.toLocaleTimeString("en-us", dateOptions)}<br /><strong>Duration:</strong> ${val.duration} minutes<br /><strong>Yoga Style: </strong> ${val.style}<br /><strong>Instructor:</strong> ${val.instructor}`;

		var form = $('#reserve-form');

		form.find('[name="id"]').val(val.id);

		$('#class-information').html(html);
	}

	var reserve = function(ev) {
		ev.preventDefault();

		$this = $(this);

		$this.find('.help').addClass('hid').html('');

		var formData = $(this).serializeObject();

		if (!validator.isEmail(formData.email)) {
			$this.find('.help').removeClass('hid').html('This is not email...')
			return
		}

		var request = {
			function: 'reserve',
			data: formData,
		}

		$.ajax({ data: JSON.stringify(request) })
		.done(function(result, textStatus, xhr) {
			showList();

			localStorage.setItem('email', formData.email);

			new Noty({
				type: 'success',
				theme: 'relax',
				text: 'Reserved!',
				timeout: 2000,
			}).show();
		})
		.fail(function(result) {
			new Noty({
				type: 'error',
				theme: 'relax',
				text: "Can't reserve!",
				timeout: 2000,
			}).show();
		});
	}

	var cancel = function(ev) {
		ev.preventDefault();

		showList();
	}

	var updateSorting = function(ev) {
		listParams.instructor = $(this).val();

		list();
	}

	// ---------------------------
	// EVENT HANDLERS
	// ---------------------------

	// Forms
	$('#reserve-form').on('submit', reserve);

	// Inputs
	$('#list-sorting').on('change', updateSorting);

	// Buttons
	$('body').on('click', '.reserve-button', showReserve);
	$('body').on('click', '.form-cancel-button', cancel);

	// ---------------------------
	// START APPLICATION
	// ---------------------------

	start();
});
