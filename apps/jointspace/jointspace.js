
function loadJointspace(){
	getCurrentChannel();	
}

function showRemote(){
	$('.row.dashboard').hide();
	$('.row.graphs').hide();
	$('.row.xbmc').hide();
	
	var html = '<img src="apps/jointspace/remote.png" alt="philips remote" border="0" usemap="#philips_remote">';
	html+= '<map id="philips_remote" name="philips_remote">';
		html+= '<area shape="rect" alt="" title="" coords="800,406,901,464" href="javascript:sendKeyEvent(\'CursorDown\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="905,342,974,398" href="javascript:sendKeyEvent(\'CursorRight\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="798,341,899,399" href="javascript:sendKeyEvent(\'Confirm\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="691,340,792,398" href="javascript:sendKeyEvent(\'CursorLeft\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="798,277,899,335" href="javascript:sendKeyEvent(\'CursorUp\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="903,278,976,334" href="javascript:sendKeyEvent(\'ChannelStepUp\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="691,277,792,335" href="javascript:sendKeyEvent(\'ChannelStepDown\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="695,470,796,528" href="javascript:sendKeyEvent(\'Back\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="234,159,295,220" href="javascript:sendKeyEvent(\'Standby\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="53,251,114,312" href="javascript:sendKeyEvent(\'Source\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="145,252,206,313" href="javascript:sendKeyEvent(\'Adjust\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="234,348,295,409" href="javascript:sendKeyEvent(\'Info\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="56,350,115,407" href="javascript:sendKeyEvent(\'AmbilightOnOff\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="235,253,296,314" href="javascript:sendKeyEvent(\'Find\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="56,443,117,504" href="javascript:sendKeyEvent(\'WatchTV\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="145,350,204,409" href="javascript:sendKeyEvent(\'Viewmode\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="235,446,294,505" href="javascript:sendKeyEvent(\'Online\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="903,465,978,526" href="javascript:sendKeyEvent(\'Options\')" target="" />';
		html+= '<area shape="circle" alt="" title="" coords="291,676,25" href="javascript:sendKeyEvent(\'Previous\')" target="" />';
		html+= '<area shape="circle" alt="" title="" coords="942,680,23" href="javascript:sendKeyEvent(\'Next\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="486,663,535,690" href="javascript:sendKeyEvent(\'Stop\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="706,665,760,691" href="javascript:sendKeyEvent(\'Pause\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="53,664,98,691" href="javascript:sendKeyEvent(\'Record\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="384,252,438,271" href="javascript:sendKeyEvent(\'RedColour\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="452,253,502,272" href="javascript:sendKeyEvent(\'GreenColour\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="521,251,570,272" href="javascript:sendKeyEvent(\'YellowColour\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="589,250,641,268" href="javascript:sendKeyEvent(\'BlueColour\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="381,164,442,223" href="javascript:sendKeyEvent(\'VolumeDown\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="479,164,544,222" href="javascript:sendKeyEvent(\'Mute\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="582,163,646,221" href="javascript:sendKeyEvent(\'VolumeUp\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="363,279,460,336" href="javascript:sendKeyEvent(\'Digit1\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="463,279,563,336" href="javascript:sendKeyEvent(\'Digit2\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="569,279,656,335" href="javascript:sendKeyEvent(\'Digit3\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="363,341,457,401" href="javascript:sendKeyEvent(\'Digit4\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="463,342,564,400" href="javascript:sendKeyEvent(\'Digit5\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="569,342,657,400" href="javascript:sendKeyEvent(\'Digit6\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="364,409,456,464" href="javascript:sendKeyEvent(\'Digit7\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="465,409,561,465" href="javascript:sendKeyEvent(\'Digit8\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="568,408,657,463" href="javascript:sendKeyEvent(\'Digit9\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="464,472,564,530" href="javascript:sendKeyEvent(\'Digit0\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="362,470,456,529" href="javascript:sendKeyEvent(\'Dot\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="569,469,658,532" href="javascript:sendKeyEvent(\'Teletext\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="600,664,654,692" href="javascript:sendKeyEvent(\'PlayPause\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="375,661,431,690" href="javascript:sendKeyEvent(\'Rewind\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="813,664,869,693" href="javascript:sendKeyEvent(\'FastForward\')" target="" />';
		html+= '<area shape="rect" alt="" title="" coords="57,162,113,222" href="javascript:sendKeyEvent(\'Home\')" target="" />';
		html+= '<area shape="rect" coords="742,482,744,486" href="#">';
		html+= '<area shape="poly" coords="69,133,63,118,57,99,51,85,50,76,31,77,19,90,24,115,32,131,37,140,42,144,58,144,69,144" href="index0.html" target="_self" alt="Toon de standaard afstandsbediening">';
	html+= '</map>';
	$('.row.remote').html(html);
	$('.row.remote').show();
}

function sendKeyEvent(KEY){
	$.ajax({
		url: _HOST_JOINTSPACE + '/1/input/key',
		data: JSON.stringify({ "key" : KEY }),
		dataType: 'json',
		type: 'POST',
	});
}

function getCurrentChannel(){
	/*
	analog
	
	false
digital
	
	"N/A"
frequency
	
	"10284"
logoid
	
	"-1"
name
	
	"TLC HD"
onid
	
	"1536"
preset
	
	"19"
sid
	
	"19566"
tsid
	
	"2106"
	*/
	
	
	$.ajax({
		url: _HOST_JOINTSPACE + '/1/channels/current',
		dataType: 'json',
		type: 'GET',
	}).done(function(data) {
	  $.ajax({
			url: _HOST_JOINTSPACE + '/1/channels/'+data.id,
			dataType: 'json',
			type: 'GET',
		}).done(function(data) {
			console.log(data);
			var html = blocks['currenchannel'];
		  	html = str_replace('[TITLE]',data.name,html);
		  	if($('#currentchannel').length>0){
				$('#currentchannel').replaceWith(html);
			}
			else{
				$('.row.dashboard').append(html);
			}
		});
	});
}