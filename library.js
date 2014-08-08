	function isNumberKey(evt)
       {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode != 46 && charCode > 31 
            && (charCode < 48 || charCode > 57))
             return false;

          return true;
       }


$(function() {

	var url = 'http://camejo-samleach.rhcloud.com/collections/football';

	populateTeamSelectList();

	$('#team-select').change(function() {
    	$( "#team-select option:selected" ).each(function() {
      		$('#points-readonly').text($(this).val());
    	});
	});

    $('#añadir').click(function() {

    	var teamName = $('#team-name').val();
    	var puntos = $('#points').val();
    	post({ equipo: teamName, puntos : puntos });

    	clear();
    	toastr.info('Añadido equipo ' + teamName + ' con ' + puntos + ' !');
	});

	$('#update').click(function() {
		var team = $("#team-select option:selected").text();
		var puntos = $( '#team-select option:selected' ).val();
		var id = $( "#team-select option:selected" ).attr("id");
		var i = parseInt($('#point-increment').val());
		var updatedPoints = parseInt(puntos) + i;

    	put({id : id, puntos : updatedPoints});		
    	clear();
    	toastr.info('Puntos para equipo ' + team + ' aumentado por ' + i + ' puntos! Total: ' + updatedPoints + '!');
	});

	$('#reset').click(function() {
		deleteAll();
		$('#team-select').empty();
		$('#team-select').append('<option>- Seleccionar equipo -</option>');
		clear();
	});

	function clear(){
		$('#team-name').val('');
    	$('#points').val('');
		$('#point-increment').val('');
    	$('#points-readonly').html('');
    	$('#team-select').prop('selectedIndex',0);
	}

	function postSuccess(o){
		var equipo = o[0].equipo;
		var puntos = o[0].puntos;
		var id = o[0]._id;
		$('#team-select').append('<option value="' + puntos + '" id="' + id + '">' + equipo + '</option>');

		//var options = $('#team-select option');		
		//var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
		//arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
		//options.each(function(i, o) {
		//  o.value = arr[i].v;
		//  $(o).text(arr[i].t);
		//});
	}

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

	function putSuccess(o){
		$( "#team-select option:selected" ).val(updatedPoints);
	}

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

	function deleteAll(){
		$.ajax({
		    type : "DELETE",
		    url : url,
			error: function(xhr, status, error) {
				toastr.error('DELETE error');
			},
			success: function(xhr, status, error) {
				toastr.info('DELETE all success');
			}
		});
	}

	function getAllSuccess(obj){
		$.each(obj, function(i, d) {
		    		if(d.equipo !== undefined){
                    	$('#team-select').append('<option value="' + d.puntos + '" id="' + d._id + '">' + d.equipo + '</option>');
                	}
                });
	}

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

});