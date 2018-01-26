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

					html = html + `<tr><td class="list-date">${date.toLocaleTimeString("en-us", dateOptions)}</td><td>${val.duration} minutes</td><td>${val.style}</td><td>${val.instructor}</td><td class="list-actions">Is full: <input type="checkbox" class="checkbox mark-full" data-id="${val.id}" ${val.full === "1" ? ' checked' : ''}><button data-id="${val.id}" class="button is-danger remove-button">Delete</button></td></tr>`;
				});

				html = html + "</tbody></table>";

				listNode.html(html);
			} catch(error) {
				console.log(error);
			}
		});

	};

	var start = function() {
		var user = localStorage.getItem('user')

		if (user) {
			showList()
		} else {
			showLoginForm()
		}
	}

	var showLoginForm = function() {
		$('section').hide();

		$('#login-section').fadeIn(500);

		$('#login-form input').val('');

		$('#logout').hide();
	}

	var showList = function() {
		$('section').hide();

		list();

		$('#logout'	).fadeIn(500);

		$('#list-section').fadeIn(500);
	}

	var showCreate = function(ev) {
		ev.preventDefault();

		$('#list-section').hide();

		$('#create-section').fadeIn(500);

		$('input', '#create-form').val('');
	}

	var create = function(ev) {
		ev.preventDefault();

    $this = $(this);

    var d = $('#input').datetimepicker('getValue');

    var formData = $(this).serializeObject();

    formData.duration = parseInt(formData.duration);

    var d = $('#datetimepicker').datetimepicker('getValue');
    formData.date = d.getTime() / 1000;

		var request = {
			function: 'create',
			data: formData,
		}

		$.ajax({ data: JSON.stringify(request) })
		.done(function(result, textStatus, xhr) {
			showList();

			new Noty({
				type: 'success',
				theme: 'relax',
				text: 'Created!',
				timeout: 2000,
			}).show();
		})
		.fail(function(result) {
			new Noty({
				type: 'error',
				theme: 'relax',
				text: "Can't create!",
				timeout: 2000,
			}).show();
		});
  }

  var remove = function(ev) {
    if (confirm('Are you sure you want to delete this class?')) {
			var $this = $(this);

			var request = {
				function: 'remove',
				data: {
					id: $(this).data('id')
				}
			}

			$.ajax({ data: JSON.stringify(request) })
			.done(function(result) {
				$this.parents('tr').remove();

				new Noty({
					type: 'success',
					theme: 'relax',
					text: 'Deleted',
					timeout: 2000,
				}).show();
			})
			.fail(function(result) {
				new Noty({
					type: 'error',
					theme: 'relax',
					text: "Can't delete the class",
					timeout: 2000,
				}).show();
			});
		}
	}

	var setFull

	var cancel = function(ev) {
		ev.preventDefault();

		showList();
	}

	var updateSorting = function(ev) {
		listParams.instructor = $(this).val();

		list();
	}

	var login = function(ev) {
		ev.preventDefault();

		var $this = $(this);

		var formData = $(this).serializeObject();

		var request = {
			function: 'login',
			data: formData
		}

		$.ajax({ data: JSON.stringify(request) })
		.done(function(result) {
			localStorage.setItem('user', JSON.stringify(result));

			showList();

			new Noty({
				type: 'success',
				theme: 'relax',
				text: 'Success',
				timeout: 2000,
			}).show();
		})
		.fail(function(result) {
			new Noty({
				type: 'error',
				theme: 'relax',
				text: "Can't login",
				timeout: 2000,
			}).show();
		});
	}

	var logout = function(ev) {
		ev.preventDefault();
		localStorage.removeItem('user');

		showLoginForm();
	}

	var markFull = function(ev) {

		var request = {
			function: 'markfull',
			data: {
				id: $(this).data('id'),
				value: $(ev.target).is(":checked")
			}
		}

		$.ajax({ data: JSON.stringify(request) })
		.done(function(result) {
			new Noty({
				type: 'success',
				theme: 'relax',
				text: 'Marked as full',
				timeout: 2000,
			}).show();
		})
		.fail(function(result) {
			new Noty({
				type: 'error',
				theme: 'relax',
				text: "Can't mark",
				timeout: 2000,
			}).show();
		});
	}

	// ---------------------------
	// EVENT HANDLERS
	// ---------------------------

	// Forms
	$('#create-form').on('submit', create);
	$('#login-form').on('submit', login);

  // Buttons
  $('.create-class').on('click', showCreate)
  $('#logout').on('click', logout)

	$('body').on('click', '.remove-button', remove);
	$('body').on('click', '.form-cancel-button', cancel);
	$('body').on('click', '.mark-full', markFull);

	// ---------------------------
	// START APPLICATION
  // ---------------------------

  jQuery('#datetimepicker').datetimepicker();

	start();
});
