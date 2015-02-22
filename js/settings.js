function openSettings(){
	$('#settingsModal').modal('show');	
}

function saveSettings(){
	$('.modal-footer .btn-primary').html(lang['saving']);
	$('#settingsModal select,#settingsModal input').each(function(){
		var value = $(this).val();
		if(typeof($(this).attr('type'))!=='undefined' && $(this).attr('type')=='checkbox'){
			if(!$(this).is(':checked')){
				value=0;	
			}
		}
		
		if(typeof(uservars[$(this).attr('name')])=='undefined'){
			$.ajax({
				url: _HOST_DOMOTICZ+'/json.htm?type=command&param=saveuservariable&vname='+$(this).attr('name')+'&vtype=2&vvalue='+value+'&jsoncallback=?',
				type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
				success: function(data) {
					window.location.reload();
				}
			});
		}
		else {
			$.ajax({
				url: _HOST_DOMOTICZ+'/json.htm?type=command&param=updateuservariable&idx='+uservars[$(this).attr('name')]['idx']+'&vname='+$(this).attr('name')+'&vtype=2&vvalue='+value+'&jsoncallback=?',
				type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
				success: function(data) {
					window.location.reload();
				}
			});
		}
	});
}