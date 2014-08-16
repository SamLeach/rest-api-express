/*
	Code that updates the DOM. 
	TODO: Use backbone or Angular
	Author: Sam Leach
	Date: 16/08/14
 */
$(function() {

	// TODO: Not sure why this is global
	var updatedPoints = 0;

	// Get all the teams and their points from the backend
	populateTeamSelectList();

	// When team select list is changed update the points text box.
	$('#team-select').change(function() {
    	$( "#team-select option:selected" ).each(function(i) {
    		// Set the text of the points text box to the value of the selected team select list option
    		$('#points-readonly').text($(this).val());
    	});
	});

	// When add button is clicked
	// Does a POST to the backend and updated the team select list to include the newly created team
    $('#añadir').click(function() {

    	// Get the team name 
    	var teamName = $('#team-name').val();

    	// Get the points from the points select list. 1 or 3
    	var puntos = $('#points-select option:selected').val(); 

    	// Do a POST to the backend passing the new team name and their points
    	post({ equipo: teamName, puntos : puntos });

    	// Clear UI controls
    	clear();

    	// Update the user via toastr
    	toastr.info('Añadido equipo ' + teamName + ' con ' + puntos + ' !');

    	// sort the teams by points TODO: This is not working
    	// for each item in the team select list add the item to an array for sorting
    	var updated = [];
    	$("#team-select").each(function()
		{
			var f = { equipo : $(this).text(), puntos : $(this).val() };
			updated.push(f);
		});

    	// sort
		updated.sort(function(a, b){
		    if(a.puntos < b.puntos) return 1;
		    if(a.puntos > b.puntos) return -1;
		    return 0;

		    // Clear the team table
		   	$('#totals tbody').html('');

		   	// Populate the table with the sorted teams
		    $.each(updated, function(i, d) {
	    		if(d.equipo !== undefined){
                	$('#totals tbody').append('<tr class="success"><td>'+d.equipo+'</td><td>'+d.puntos+'</td></tr>');
            	}
	        });
		});
	});

    // When update button is clicked
    // Does a PUT and updates the results table
	$('#update').click(function() {
		// Get the selected team name
		var team = $("#team-select option:selected").text();

		// Get the selected team points
		var puntos = $( '#team-select option:selected' ).val();

		// Get the selected team's id.
		var id = $( "#team-select option:selected" ).attr("id");

		// Get the amount to increment by. 1 or 3
		var i = parseInt($('#point-increment option:selected').val());

		// Increment by the selected amount
		updatedPoints = parseInt(puntos) + i;

		// Do a PUT to the backend
    	put({id : id, puntos : updatedPoints});

    	// Update the user with toastr		
    	toastr.info('Puntos para equipo ' + team + ' aumentado por ' + i + ' puntos! Total: ' + updatedPoints + '!');

    	// Update the results table
    	var tableRow = $("td").filter(function() {
		    return $(this).text() == team;
		}).closest("tr");

    	tableRow.html('<td>'+team+'</td><td>'+updatedPoints+'</td>');
	});

	// When delete button is clicked
	// Does a DELETE
	$('#delete').click(function() {
		// Get team name to be used by toastr
		var team = $("#team-select option:selected").text();

		// Get the team id to be passed to the DELETE backend
		var id = $( "#team-select option:selected" ).attr("id");

		// Call backend with DELETE
		deleteTeam(id);

		// Update the user		
		toastr.error(team + ' eliminado!');

		// Reset the team select list to its default selection
		$('#team-select').prop('selectedIndex',0);
	});

	// Deletes all the teams
	// Does a Drop collection in Mongo
	$('#reset').click(function() {
		// Call backend with DELETE with no id specified
		deleteAll();

		// Remove everything from the team select list
		$('#team-select').empty();

		// Add the default selected option back in to the team select list
		$('#team-select').append('<option>- Seleccionar equipo -</option>');

		// Reset the rest of the UI controls
		clear();
	});

	// Clears or resets the UI controls. (Text boxes and select lists).
	function clear(){
		$('#team-name').val('');
    	$('#points').prop('selectedIndex',0);
		$('#point-increment').prop('selectedIndex',0);
    	$('#points-readonly').html('');
    	$('#team-select').prop('selectedIndex',0);
	}
});