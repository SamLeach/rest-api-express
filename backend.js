/*
	Code that calls the backend Json service via ajax
	Author: Sam Leach
	Date: 16/08/14
 */

// The backend json api url
var url = 'http://camejo-samleach.rhcloud.com/collections/football';

// Append the newly created team to the team select list
function postSuccess(o){

	// team
	var equipo = o[0].equipo;

	// points
	var puntos = o[0].puntos;

	// id
	var id = o[0]._id;

	// Append the newly created team to the team select list
	$('#team-select').append('<option value="' + puntos + '" id="' + id + '">' + equipo + '</option>');
}

// Creates a new team. Json is "{ equipo: 'Team Name', puntos: 3 }"
// NOTE: Currently uses parameters (in the form url/equipo/puntos)
// On Error is displays a toastr error message
// On Success the callback is called
function post(data){
	$.ajax({
	    type : "POST",
	    url : url + '/' + data.equipo + '/' + data.puntos,
	    success: postSuccess,
		error: function(xhr, status, error) {
			toastr.error('POST error');
		}
	});
}

// Update the team select list with the updated value for the team's points
function putSuccess(o){
	// make sure we have a string
	var p = updatedPoints.toString();

	// update the value (the team's points) part of the selected team
	$( "#team-select option:selected" ).val(p);

	// reset this global
	updatedPoints = 0;

	// Clear the UI controls
	clear();
}

// Updates an existing Team's points
// Uses parameters instead of Json because the Body Parser in version 4 of express is broken on OpenShift
// In the form url/id/points
function put(data){
	$.ajax({
	    type : "PUT",
	    url : url + '/' + data.id + '/' + data.puntos,
	    success: putSuccess,
		error: function(xhr, status, error) {
			toastr.error('PUT error');
		}
	});
}

// Drops the futbol collection from mongo
function deleteAll(){
	$.ajax({
	    type : "DELETE",
	    url : url,
		error: function(xhr, status, error) {
			toastr.error('DELETE error');
		}
	});
}

// Delete a Team by Id from mongo
function deleteTeam(id){
	$.ajax({
	    type : "DELETE",
	    url : url + '/' + id,
		error: function(xhr, status, error) {
			toastr.error('DELETE error');
		}
	});
}

// Get all the teams callback
// Builds the team select list and the results table
function getAllSuccess(obj){
	
	// sort
	obj.sort(function(a, b){
	    if(a.puntos < b.puntos) return 1;
	    if(a.puntos > b.puntos) return -1;
	    return 0;
	})

	// build the team select list and results table
	$.each(obj, function(i, d) {
		// We don't like undefined teams
		if(d.equipo !== undefined){
			// Populate team select list
        	$('#team-select').append('<option value="' + d.puntos + '" id="' + d._id + '">' + d.equipo + '</option>');
        	// Populate results table
        	$('#totals tbody').append('<tr class="success"><td>'+d.equipo+'</td><td>'+d.puntos+'</td></tr>');
    	}
    });
}

// Gets all the teams and their points
function populateTeamSelectList(){
	$.ajax({
	    type : "GET",
	    dataType : "jsonp",
	    contentType: "application/json",
	    url : url,
	    success: getAllSuccess,
		error: function(xhr, status, error) {
			toastr.error('GET error');
		}
	});
} 