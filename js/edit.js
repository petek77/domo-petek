function openEditmode(){
	if(!$('#editmode').hasClass('active')){
		$('#editmode').addClass('active');
		
		$('.panel').each(function(){
			var panel = $(this);
			panel.prepend('<div class="editclick" />');
			var ix='';
			if(typeof(panel.data('idx'))!=='undefined'){
				var idx = panel.data('idx');
				panel.find('.editclick').height(panel.height());
				panel.find('.editclick').width(panel.width());
				
				panel.find('.editclick').bind( "click", function(e) {
					
					$('div#wrapper').append(blocks['editblock']);
					$('#editblockModal #name').val(alldevices[idx]['Name']);
					
					if(typeof(alldevices[idx]['SwitchType'])!=='undefined'){
						$('#editblockModal #switchtype').val(alldevices[idx]['SwitchTypeVal']);
					}
					else {
						$('#editblockModal #switchtype').parents('.row').hide();
					}
					
					$('#editblockModal').data('idx',idx).modal('show');	
					e.preventDefault();
					
				});
				
			}
		});
		
		
		$( ".row.dashboard" ).sortable({
			update: function () {
				var order1 = $(this).sortable('toArray').toString();
				order1 = str_replace('device','d',order1);
				if(typeof(uservars['dashticz_blockorder'])=='undefined'){
					$.ajax({
						url: _HOST_DOMOTICZ+'/json.htm?type=command&param=saveuservariable&vname=dashticz_blockorder&vtype=2&vvalue='+order1+'&jsoncallback=?',
						type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
						success: function(data) {
							
						}
					});
				}
				else {
					$.ajax({
						url: _HOST_DOMOTICZ+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_blockorder']['idx']+'&vname=dashticz_blockorder&vtype=2&vvalue='+order1+'&jsoncallback=?',
						type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
						success: function(data) {
							
						}
					});
					
				}
			}	
		});
			
	}
	else {
		$( ".row.dashboard" ).sortable('destroy');
		$('#editmode').removeClass('active');	
		$('.panel').unbind( "click" );
	}
}

function saveEditblock(idx){
	var modal = $('#editblockModal');
	var idx = modal.data('idx');
	
	/*WILL CLEAN THIS FUNCTION UP LATER! */
	$('#editblockModal').remove();
	$('div#wrapper').append(blocks['loading']);
	$('#loadingModal').modal('show');	
	
	var used=true;
	if(alldevices[idx]['Type']=='Temp'){ //temperature blocks
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=setused&idx='+idx+'&name='+modal.find('#name').val()+'&used='+used+'&addjvalue='+alldevices[idx]['AddjValue']+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				
				if(!modal.find('#hide').is(':checked')){
					$('#loadingModal').remove();
					window.location.reload(); 
				}
			}
		});
	}
	else if(typeof(alldevices[idx]['SwitchType'])!=='undefined'){ //switches, dimmers etc.
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=setused&idx='+idx+'&name='+modal.find('#name').val()+'&strparam1='+alldevices[idx]['StrParam1']+'&strparam2='+alldevices[idx]['StrParam2']+'&protected='+alldevices[idx]['Protected']+'&switchtype='+modal.find('#switchtype').val()+'&customimage='+alldevices[idx]['CustomImage']+'&used='+used+'&addjvalue='+alldevices[idx]['AddjValue']+'&addjvalue2='+alldevices[idx]['AddjValue2']+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				if(!modal.find('#hide').is(':checked')){
					$('#loadingModal').remove();
					window.location.reload(); 
				}
			}
		});
	}
	else {
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=setused&idx='+idx+'&name='+modal.find('#name').val()+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				
				if(!modal.find('#hide').is(':checked')){
					$('#loadingModal').remove();
					window.location.reload(); 
				}
			}
		});
	}
	
	if(modal.find('#hide').is(':checked')){
		_BLOCKSHIDE[idx] = idx;	
		var savehide = '';
		for(b in _BLOCKSHIDE){
			savehide+=b+',';
		}
		
		//savehide = JSON.stringify(_BLOCKSHIDE);
		if(typeof(uservars['dashticz_blockhide'])=='undefined'){
			$.ajax({
				url: _HOST_DOMOTICZ+'/json.htm?type=command&param=saveuservariable&vname=dashticz_blockhide&vtype=2&vvalue='+savehide+'&jsoncallback=?',
				type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
				success: function(data) {
					$('#loadingModal').remove();
					window.location.reload(); 
				}
			});
		}
		else {
			$.ajax({
				url: _HOST_DOMOTICZ+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_blockhide']['idx']+'&vname=dashticz_blockhide&vtype=2&vvalue='+savehide+'&jsoncallback=?',
				type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
				success: function(data) {
					$('#loadingModal').remove();
					window.location.reload(); 
				}
			});
		}
		
	}
}