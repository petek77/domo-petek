//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var req;
var slide;
var sliding = false;
var dashticz_version='0.69';
var temperatureBlock=new Object();
var sliderlist = new Object();
var alldevices = new Object();
var uservars = new Object();
var showNavigation;

var _DOMOTICZHOST='';
var _LANGUAGE='en_US';
var _THEME='default';
var _XBMCSWITCH='';
var _XBMCHOST='';

var _BLOCKSORDER = false;
var _BLOCKSHIDE = new Object();
var _FAVORITES=0;
var _DEBUG=false;

var _DEBUG_JSON = '';

$(document).ready(function(){	
   $.get(_DOMOTICZHOST+'/json.htm?type=command&param=getuservariables',function(data){
	    data=$.parseJSON(data);
		for(r in data.result){
			uservars[data.result[r]['Name']] = data.result[r];
		}
		
		if(typeof(uservars['dashticz_blockorder'])!=='undefined'){
			_BLOCKSORDER = uservars['dashticz_blockorder']['Value'].split(',');
		}
		
		if(typeof(uservars['dashticz_blockhide'])!=='undefined'){
			_BLOCKSHIDE = $.parseJSON(uservars['dashticz_blockhide']['Value'].split(','));
		}
		
		if(typeof(uservars['dashticz_pathdomoticz'])!=='undefined') _DOMOTICZHOST = uservars['dashticz_pathdomoticz']['Value'];
		if(typeof(uservars['dashticz_language'])!=='undefined') _LANGUAGE = uservars['dashticz_language']['Value'];
		if(typeof(uservars['dashticz_theme'])!=='undefined') _THEME = uservars['dashticz_theme']['Value'];
		if(typeof(uservars['dashticz_onlyfavorites'])!=='undefined') _FAVORITES = uservars['dashticz_onlyfavorites']['Value'];
		if(typeof(uservars['dashticz_xbmcswitch'])!=='undefined') _XBMCSWITCH = uservars['dashticz_xbmcswitch']['Value'];
		if(typeof(uservars['dashticz_pathxbmc'])!=='undefined') _XBMCHOST = uservars['dashticz_pathxbmc']['Value'];

		$.getScript( 'js/languages/'+_LANGUAGE+'.js',function(){
			if(_XBMCSWITCH!=='' || _XBMCHOST!=='') $.getScript( 'js/xbmc.js');
			$.getScript( 'js/blocks.js');
			$.getScript( 'js/functions.js');
			
			$.getScript( 'themes/'+_THEME+'/js/config.js',function(){
				$.getScript( 'themes/'+_THEME+'/js/blocks.js',function(){
				
					$('div#wrapper').append(blocks['topbar']);
					$('div#wrapper').append(blocks['blocks']);
					if(showNavigation) $('div#wrapper').append(blocks['navigation']);
					$('div#wrapper').append(blocks['settings']);
					
					$('span#dversion').html(dashticz_version);
		
					$('link#themecss').attr('href','themes/'+_THEME+'/css/style.css');
					$('img#logo').attr('src','themes/'+_THEME+'/images/logo.png');
					
					$.get(_DOMOTICZHOST+'/json.htm?type=command&param=getversion',function(data){
						data=$.parseJSON(data);
						$('span#version').html(data.version);
					});
					
					if(_XBMCHOST!=="") loadXBMC();
					autoGetDevices();
				});
			});
		});
	});
});

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
			$.get(_DOMOTICZHOST+'/json.htm?type=command&param=saveuservariable&vname='+$(this).attr('name')+'&vtype=2&vvalue='+value);
		}
		else {
			$.get(_DOMOTICZHOST+'/json.htm?type=command&param=updateuservariable&idx='+uservars[$(this).attr('name')]['idx']+'&vname='+$(this).attr('name')+'&vtype=2&vvalue='+value);
		}
	});
	setTimeout(function(){ window.location.reload(); },1000);
}

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
				if(typeof(uservars['dashticz_blockorder'])=='undefined'){
					$.get(_DOMOTICZHOST+'/json.htm?type=command&param=saveuservariable&vname=dashticz_blockorder&vtype=2&vvalue='+order1);
				}
				else {
					$.get(_DOMOTICZHOST+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_blockorder']['idx']+'&vname=dashticz_blockorder&vtype=2&vvalue='+order1);
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
		$.get(_DOMOTICZHOST+'/json.htm?type=setused&idx='+idx+'&name='+modal.find('#name').val()+'&used='+used+'&addjvalue='+alldevices[idx]['AddjValue'],function(data){ 
			if(!modal.find('#hide').is(':checked')){
				$('#loadingModal').remove();
				window.location.reload(); 
			}
		});
	}
	else if(typeof(alldevices[idx]['SwitchType'])!=='undefined'){ //switches, dimmers etc.
		$.get(_DOMOTICZHOST+'/json.htm?type=setused&idx='+idx+'&name='+modal.find('#name').val()+'&strparam1='+alldevices[idx]['StrParam1']+'&strparam2='+alldevices[idx]['StrParam2']+'&protected='+alldevices[idx]['Protected']+'&switchtype='+modal.find('#switchtype').val()+'&customimage='+alldevices[idx]['CustomImage']+'&used='+used+'&addjvalue='+alldevices[idx]['AddjValue']+'&addjvalue2='+alldevices[idx]['AddjValue2'],function(data){ 
			if(!modal.find('#hide').is(':checked')){
				$('#loadingModal').remove();
				window.location.reload(); 
			}
		});
	}
	
	if(modal.find('#hide').is(':checked')){
		_BLOCKSHIDE[idx] = idx;	
		savehide = JSON.stringify(_BLOCKSHIDE);
		if(typeof(uservars['dashticz_blockhide'])=='undefined'){
			$.get(_DOMOTICZHOST+'/json.htm?type=command&param=saveuservariable&vname=dashticz_blockhide&vtype=2&vvalue='+savehide,function(data){ 
				$('#loadingModal').remove();
				window.location.reload(); 
			});
		}
		else {
			$.get(_DOMOTICZHOST+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_blockhide']['idx']+'&vname=dashticz_blockhide&vtype=2&vvalue='+savehide,function(data){ 
				$('#loadingModal').remove();
				window.location.reload(); 
			});
		}
		
	}
}

function switchTheme(theme){
	$('link#theme').attr('href','themes/'+theme+'/css/style.css');	
	if(typeof(uservars['dashticz_theme'])=='undefined'){
		$.get(_DOMOTICZHOST+'/json.htm?type=command&param=saveuservariable&vname=theme&vtype=2&vvalue='+theme);
	}
	else {
		$.get(_DOMOTICZHOST+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_theme']['idx']+'&vname=theme&vtype=2&vvalue='+theme);
	}
		
}

function autoGetDevices(){
	getDevices();
	setTimeout(function(){ autoGetDevices (); },60000);
}

function getDevices(){
	if(!sliding){
		if(typeof(req)!=='undefined') req.abort();
		req = $.get(_DOMOTICZHOST+'/json.htm?type=devices&filter=all&used=true&order=Name',function(data){
			if(_DEBUG) data = _DEBUG_JSON;
			data=$.parseJSON(data);
			for(r in data.result){
				alldevices[data.result[r]['idx']] = data.result[r];
				if(_XBMCHOST!=="") getXbmc(data.result[r]);
							
				if(
					(
						(_FAVORITES==1 && data.result[r]['Favorite']==1) || 
						_FAVORITES==0 || 
						(
							typeof(uservars['dashticz_sunswitch'])!=='undefined' && data.result[r]['Name']==uservars['dashticz_sunswitch']['Value']	
						)
					)
					
				){
					if(typeof(data.result[r]['CounterToday'])!=='undefined') var current=lang['graph_today']+' '+data.result[r]['CounterToday'];
						else if(typeof(data.result[r]['Usage'])!=='undefined') var current=data.result[r]['Usage'];
						else if(typeof(data.result[r]['Rain'])!=='undefined') var current=data.result[r]['Rain']+'mm';
						else if(typeof(data.result[r]['Status'])!=='undefined') var current=data.result[r]['Status'];
						else if(data.result[r]['TypeImg']=='temperature'){
						var current=data.result[r]['Data'].split(' ');
						current = current[0]+'&deg;';
					}
					else var current=data.result[r]['Data'];
					
					if(data.result[r]['SubType']=='Energy' || data.result[r]['Type']=='Energy'){
						current = lang['graph_current']+' '+data.result[r]['Usage']+', '+current;
					}
					if(data.result[r]['SubType']=='Electric'){
						current = parseFloat(data.result[r]['Data'].replace( / Watt$/g, ''));
					}
					if(data.result[r]['SwitchType']=='Dimmer'){
						current = data.result[r]['Level'];
					}
					
					if(
						data.result[r]['HardwareName']=='Motherboard'
					){
						var html = '<span id="system'+data.result[r]['idx']+'">'+data.result[r]['Name']+': <B>'+current+'</B>&nbsp;&nbsp;&nbsp;</span>';
						if($('#system'+data.result[r]['idx']).length>0){
							$('#system'+data.result[r]['idx']).replaceWith(html);
						}
						else $('#systeminfo').append(html);
					}
					
					

					// now process data	
					if(
						data.result[r]['SubType']=='Energy' ||
						data.result[r]['Type']=='Energy' ||
						data.result[r]['SubType']=='Gas' ||
						data.result[r]['SubType']=='Electric'
					){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],lang['graph_usage'],'last',current,false,'counter');
					}
					else if (data.result[r]['HardwareName']=='Motherboard' && data.result[r]['Type']=='Temp'){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],lang['graph_temperature'],'last',current,false,'temp');
					}
					else if (data.result[r]['HardwareName']=='Motherboard' && (stristr(data.result[r]['Name'],'cpu') || stristr(data.result[r]['Name'],'hdd') || stristr(data.result[r]['Name'],'geheugen') || stristr(data.result[r]['Name'],'memory'))){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],lang['graph_percentage'],'last',current,false,'Percentage');
					}
					else if(
						data.result[r]['SubType']=='Solar Radiation'
					){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],lang['graph_radiation'],'last',current,false,'counter');
					}
					else if(
						typeof(uservars['dashticz_sunswitch'])!=='undefined' && data.result[r]['Name']==uservars['dashticz_sunswitch']['Value']
					){
						if(current=='On') var html = '<span id="device'+data.result[r]['idx']+'"><i class="fa fa-sun-o"></i></span>';
						if(current=='Off') var html = '<span id="device'+data.result[r]['idx']+'"><i class="fa fa-moon-o"></i></span>';
						if($('#device'+data.result[r]['idx']).length>0){
							$('#device'+data.result[r]['idx']).replaceWith(html);

						}
						else $('#sun').append(html);
					}
					else {
	
						if(data.result[r]['Type']=='Temp + Humidity + Baro' || data.result[r]['Type']=='Rain' || data.result[r]['Type']=='Wind'){
							if(typeof(temperatureBlock['Wunderground'])=='undefined'){
								temperatureBlock['Wunderground'] = new Object();
							}
							
							if(data.result[r]['Type']=='Wind'){ 
								temperatureBlock['Wunderground']['Direction'] = data.result[r]['DirectionStr']; 
								temperatureBlock['Wunderground']['Gust'] = data.result[r]['Gust']; 
							}
							else if(typeof(data.result[r]['Rain'])!=='undefined'){ temperatureBlock['Wunderground']['Rain'] = data.result[r]['Rain']; }
							else if(typeof(data.result[r]['ForecastStr'])!=='undefined'){
								temperatureBlock['Wunderground']['Forecast'] = data.result[r]['ForecastStr'];
								
								d = data.result[r]['Data'].split(', ');
								temperatureBlock['Wunderground']['Temp'] = d[0].replace(' C','&deg;');
								temperatureBlock['Wunderground']['Humidity'] = d[1];
								temperatureBlock['Wunderground']['Pressure'] = d[2];
								temperatureBlock['Wunderground']['DewPoint'] = data.result[r]['DewPoint'];
								temperatureBlock['Wunderground']['HumidityStatus'] = data.result[r]['HumidityStatus'];
							}
							
						}
						else if(!sliding && typeof(_BLOCKSHIDE[data.result[r]['idx']])=='undefined'){
							var currentdate = '<span class="small">'+lang['last_seen']+': '+date('d-m H:i',strtotime(data.result[r]['LastUpdate']))+'</span>';
							
							if(
								(data.result[r]['Status']!=='Off' && parseFloat(data.result[r]['Level'])>0) || 
								data.result[r]['Status']=='On' ||
								parseFloat(data.result[r]['Rain'])>0
							){
								var iconclass = 'icon-active';
								var deviceactive = 'device-online';
							}
							else {
								var iconclass = 'icon-inactive';
								var deviceactive = 'device-offline';
							}
								
							var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="device'+data.result[r]['idx']+'">';
								html+='<div class="panel panel-block panel-default '+deviceactive+'" data-idx="'+data.result[r]['idx']+'">';
									html+='<div class="panel-heading';
									if(data.result[r]['TypeImg']=='temperature') html+=' nodetails';
									html+='">';
										html+='<div class="row">';
											html+='<div class="col-xs-8">';
												if(data.result[r]['SwitchType']=='Dimmer'){
													//html+='<div>'+data.result[r]['Name']+' ('+current+')</div>';
													html+='<div>'+data.result[r]['Name']+' (<span id="current'+data.result[r]['idx']+'">'+current+'</span>%)</div>';
													html+='<div>';
													html+='<input type="text" class="span2" value="'+data.result[r]['Level']+'" id="sl'+data.result[r]['idx']+'" >';
													html+='</div>'
												}
												else /*if(data.result[r]['TypeImg']=='temperature'){
													html+='<div class="huge">'+current+'</div>';
													html+='<div class="small">'+data.result[r]['Name']+'</div>';
												}
												else */{
													html+='<div class="huge">'+current+'</div>';
													html+='<div>'+data.result[r]['Name']+'</div>';
												}
											html+='</div>';
											html+='<div class="col-xs-4 text-right icon">';
											
												var icon='';
												
												if(data.result[r]['Image']=='Media'){
													icon='fa fa-play-circle-o';
												}
												else if(data.result[r]['Type']=='Scene' || data.result[r]['Type']=='Group' || data.result[r]['Image']=='Light') icon='fa fa-lightbulb-o';
												else if(data.result[r]['Image']=='Heating') icon='fa fa-fire';
												else if(data.result[r]['TypeImg']=='temperature') icon='wi wi-thermometer';
												else if(data.result[r]['SubType']=='Solar Radiation') icon='fa fa-sun-o';
												else if(data.result[r]['Type']=='Rain') icon='fa fa-umbrella';
												else if(data.result[r]['Type']=='Wind') icon='fa fa-location-arrow';
												
												
												
												html+='<i class="mainicon '+icon+' '+iconclass+'"></i>';
												
											html+='</div>';
										html+='</div>';
									html+='</div>';
									
									var setslide='';
									//if(data.result[r]['Name']=='Voordeur' || data.result[r]['Name']=='Deurbel') console.log(data.result[r]);
									if(data.result[r]['SwitchType']=='Push On Button' || data.result[r]['SwitchType']=='On/Off' || data.result[r]['SwitchType']=='Doorbell' || data.result[r]['SwitchType']=='Door Lock' || data.result[r]['Type']=='Scene' || data.result[r]['Type']=='Group'){
										if(data.result[r]['Protected'] == true){
											html+='<div class="panel-footer">';
											html+='<span class="pull-left">'+lang['locked']+currentdate+'</span>';
											html+='<span class="pull-right"><i class="fa fa-lock"></i></span>';
											html+='<div class="clearfix"></div>';
										}
										else if(data.result[r]['Type']=='Scene') {
											html+='<a href="javascript:switchScene('+data.result[r]['idx']+');">';
												html+='<div class="panel-footer">';
													html+='<span class="pull-left">'+lang['turn_on']+currentdate+'</span>';
													html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
													html+='<div class="clearfix"></div>';
												html+='</div>';
											html+='</a>';
										}
										else if(data.result[r]['SwitchType']=='Doorbell' || data.result[r]['SwitchType']=='Push On Button' || data.result[r]['SwitchType']=='Door Lock') {
											html+='<a href="javascript:switchDevice('+data.result[r]['idx']+');">';
												html+='<div class="panel-footer">';
													html+='<span class="pull-left">'+lang['activate']+currentdate+'</span>';
													html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
													html+='<div class="clearfix"></div>';
												html+='</div>';
											html+='</a>';
										}
										else if(data.result[r]['Type']=='Group') {
											html+='<a href="javascript:switchGroup('+data.result[r]['idx']+');">';
												html+='<div class="panel-footer">';
													html+='<span class="pull-left">'+lang['switch']+currentdate+'</span>';
													html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
													html+='<div class="clearfix"></div>';
												html+='</div>';
											html+='</a>';
										}
										else{
											html+='<a href="javascript:switchDevice('+data.result[r]['idx']+');">';
												html+='<div class="panel-footer">';
													html+='<span class="pull-left">'+lang['switch']+currentdate+'</span>';
													html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
													html+='<div class="clearfix"></div>';
												html+='</div>';
											html+='</a>';
										}
									}
									else if(data.result[r]['SwitchType']=='Dimmer'){
										html+='<a href="javascript:slideDeviceToggle('+data.result[r]['idx']+');">';
											html+='<div class="panel-footer">';
												html+='<span class="pull-left">'+lang['switch']+currentdate+'</span>';
												html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
												html+='<div class="clearfix"></div>';
											html+='</div>';
										html+='</a>';
										var setslide = 'sl'+data.result[r]['idx'];
									}
									else if(data.result[r]['TypeImg']!=='temperature') {
											//console.log(data.result[r]);
										html+='<a href="javascript:void(0);">';
											html+='<div class="panel-footer">';
												html+='<span class="pull-left">&nbsp;</span>';
												html+='<span class="pull-right"></span>';
												html+='<div class="clearfix"></div>';
											html+='</div>';
										html+='</a>';
									}
									
								html+='</div>';
							html+='</div>';
						
							if($('#device'+data.result[r]['idx']).length>0){
								$('#device'+data.result[r]['idx']).replaceWith(html);
							}
							else $('.row.dashboard').append(html);
						}
						
						if(setslide!==''){
							var current = parseFloat($('#'+setslide).val());
							
							if(data.result[r]['Type'] == 'Lighting Limitless/Applamp'){
								sliderlist[setslide] = current;
								$('#'+setslide).slider({
									value:sliderlist[setslide],
									step: 10,
									min:1,
									max:100
								})
								.on('slide', function(ev){
									sliding = true;
								})
								.on('slideStop', function(ev){
									$('#current'+ $(this).attr('id').substr(2)).text(ev.value);
									slideDevice($(this).attr('id').substr(2),ev.value);
								});
							}
							else {
								sliderlist[setslide] = Math.ceil((current/100)*16);
								$('#'+setslide).slider({
									value:sliderlist[setslide],
									step: 1,
									min:1,
									max:16
								})
								.on('slide', function(ev){
									sliding = true;
								})
								.on('slideStop', function(ev){
									$('#current'+ $(this).attr('id').substr(2)).text(Math.ceil(ev.value/0.16));
 									slideDevice($(this).attr('id').substr(2),ev.value);
								});
							}
							setslide='';
						}
			
					}
				}
			}
			
			if(typeof(temperatureBlock['Wunderground'])!=='undefined'){
				var wg = temperatureBlock['Wunderground'];
				var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="wunderground">';
					html+='<div class="panel panel-default">';
						html+='<div class="panel-heading nodetails">';
							html+='<div class="row">';
								html+='<div class="col-xs-8">';
									html+='<div class="huge">'+wg['Temp']+'</div>';
									html+='<div class="small">';
									if(typeof(wg['Rain'])!=='undefined') html+='Rain: '+wg['Rain']+'mm<br />';
									if(typeof(wg['Gust'])!=='undefined') html+='Gust: '+wg['Gust']+', '+wg['Direction']+'<br />';
									if(typeof(wg['Humidity'])!=='undefined') html+='Pressure: '+wg['Pressure']+', '+wg['Humidity']+'<br />';
									html+='</div>';
								html+='</div>';
								html+='<div class="col-xs-4 text-right" style="padding-left:0px;">';

									var icon = 'fa-umbrella';
									if((typeof(wg['Rain'])!=='undefined' && wg['Rain']>0) || stristr(wg['Forecast'], 'rain')){
										var iconclass = 'Skycons.RAIN';
									}
									else if(stristr(wg['Forecast'], 'Partly Cloudy')){
										var iconclass = 'Skycons.PARTLY_CLOUDY_DAY';
									}
									else if(stristr(wg['Forecast'],'sunny')){
										var iconclass = 'Skycons.CLEAR_DAY';
									}
									else if(stristr(wg['Forecast'],'clear')){
										var iconclass = 'Skycons.CLEAR_NIGHT';
									}
									else if(stristr(wg['Forecast'],'Cloudy')){
										var iconclass = 'Skycons.CLOUDY';
									}
									else if(stristr(wg['Forecast'],'sleet')){
										var iconclass = 'Skycons.SLEET';
									}
									else if(stristr(wg['Forecast'],'snow')){
										var iconclass = 'Skycons.SNOW';
									}
									else if(stristr(wg['Forecast'],'wind')){

										var iconclass = 'Skycons.WIND';
									}
									else if(stristr(wg['Forecast'],'fog')){
										var iconclass = 'Skycons.FOG';
									}
									else {
										var iconclass = 'Skycons.CLEAR_DAY';
									}
					  
									html+='<canvas title="'+wg['Forecast']+'" id="icon_wg" width="56" height="56" style="margin-top:5px;"></canvas>';
								html+='</div>';
							html+='</div>';
						html+='</div>';
						
					html+='</div>';
				html+='</div>';
				
				if($('#wunderground').length>0){
					$('#wunderground').replaceWith(html);
				}
				else $('.row.dashboard').first().prepend(html);
				
				var skycons = new Skycons({"color": "#ccc"});
  				skycons.add("icon_wg", eval(iconclass));
				skycons.play();
				
				if(
					typeof(uservars['dashticz_latitude'])!=='undefined' && uservars['dashticz_latitude']['Value']!=='' && 
					typeof(uservars['dashticz_longitude'])!=='undefined' && uservars['dashticz_longitude']['Value']!==''
				){
					$.get('http://www.84media.nl/projects/dashticz/buienradar.php?lat='+uservars['dashticz_latitude']['Value']+'&lon='+uservars['dashticz_longitude']['Value'],function(data){
						data=$.parseJSON(data);
						var data_radar = new Array();
						for(d in data){
							if(data[d]!==""){
								var rain = data[d].split('|');
								//rain[0] = rain[0]+Math.floor(Math.random()*11)-8;
								//if(rain[0]<0) rain[0] = 1;
								data_radar[d] = {
									xkey: rain[1],
									ykey: rain[0]
								}; 
							}
						}
						
						var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="buienradar">';
							html+='<div class="panel panel-default">';
								html+='<div class="panel-heading nodetails">';
									html+='<div class="row">';
										html+='<div class="col-xs-12">';
											html+='<div class="huge">Buienradar</div>';
											html+='<div id="graph_radar" style="height: 100px;"></div>';
										html+='</div>';
									html+='</div>';
								html+='</div>';
								
							html+='</div>';
						html+='</div>';
					
						if($('#buienradar').length>0){
							$('#buienradar').replaceWith(html);
						}
						else $('.row.dashboard').first().prepend(html);
						
						Morris.Bar({
							parseTime:false,
							element: 'graph_radar',
							data: data_radar,
							xkey: 'xkey',
							ykeys: ['ykey'],
							labels: ['Neerslag'],
							lineColors: [graphColor],
							pointFillColors: ['none'],
							pointSize: 2,
							xLabelMargin: 1,
							hideHover: 'auto',
							resize: true
						});
					});
				}
			}
			
			for(bo in _BLOCKSORDER){
				var clone = $('#'+_BLOCKSORDER[bo]);
				var parent = $('#'+_BLOCKSORDER[bo]).parent();
				$('#'+_BLOCKSORDER[bo]).remove();
				parent.append(clone);
			}	
		});
	}
}

function showDashboard(){
	$('.row').show();
	$('.row.xbmc').hide();
}

function showGraph(idx,title,label,range,current,forced,sensor){
	
	if(typeof(forced)=='undefined') forced=false;
	
	if(!forced && $('#device'+idx).length>0){
		//if month, dan once a day
	}
	else {
		realrange=range;
		if(range=='last') realrange='day';
		$.get(_DOMOTICZHOST+'/json.htm?type=graph&sensor='+sensor+'&idx='+idx+'&range='+realrange,function(data){
			
			var html = '<div class="row dashboard" id="device'+idx+'">';
				html+='<div class="col-lg-12">';
                    html+='<div class="panel panel-default" data-idx="'+idx+'">';
                        html+='<div class="panel-heading graph"><div class="pull-left">';
                            html+=title+': <B>'+current+'</B>';
							if(range=='last') html+='<br />'+lang['graph_last_hours']+':';
							if(range=='day') html+='<br />'+lang['graph_today']+':';
							if(range=='month') html+='<br />'+lang['graph_last_month']+':';
                            html+='</div><div class="pull-right">';
                                html+='<div class="btn-group">';
                                   
									html+='<button type="button" class="btn btn-default ';
									if(range=='last') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'last\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_last_hours']+'</button> ';
									
									html+='<button type="button" class="btn btn-default ';
									if(range=='day') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'day\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_today']+'</button> ';
									
									html+='<button type="button" class="btn btn-default ';
									if(range=='month') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'month\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_last_month']+'</button>';
                                html+='</div>';
                            html+='</div><div class="clearfix"></div>';
                        html+='</div>';
                        html+='<div class="panel-body">';
                            html+='<div id="graph'+idx+'"></div>';
                        html+='</div>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';
			
			
			data=$.parseJSON(data);
			if(data.status=="ERR") alert('Could not load graph!');
			else {
				if($('#device'+idx).length>0){
					$('#device'+idx).replaceWith(html);
				}
				else $('.row.dashboard:last').after(html);
					var data_com=new Array();
				var count=0;
				for(r in data.result){
					
					var currentdate = data.result[r].d;
					var currentstamp = strtotime(currentdate);
					var currenttimeLessFour = Math.round((new Date().getTime()) / 1000)-(3600*4);
					//console.log('DIFF: '+currentstamp+' > '+currenttimeLessFour);
					
					if(range=='month' || range=='year'){
						currentdate = currentdate.split('-');
						currentdate = currentdate[2]+'/'+currentdate[1];
					}
					else {
						currentdate = currentdate.split(' ');
						currentdate = currentdate[1];
						
						hourmin = currentdate.split(':');
					}
					
					if(range!=='last' || (range=='last' && currentstamp>currenttimeLessFour)){
						
						if(typeof(data.result[r]['te'])!=='undefined'){
							data_com[count] = {
								xkey: currentdate,
								ykey: data.result[r]['te']
							}; 
						}
						else if(typeof(data.result[r]['v_max'])!=='undefined'){
							data_com[count] = {
								xkey: currentdate,
								ykey: data.result[r]['v_max']
							}; 
						}
						else if(typeof(data.result[r]['v2'])!=='undefined'){
							data_com[count] = {
								xkey: currentdate,
								ykey: parseFloat(data.result[r]['v2'])+parseFloat(data.result[r]['v'])
							}; 
						}
						else if(typeof(data.result[r]['v'])!=='undefined'){
							data_com[count] = {
								xkey: currentdate,
								ykey: data.result[r]['v']
							}; 
						}
						else if(typeof(data.result[r]['u'])!=='undefined'){
							data_com[count] = {
								xkey: currentdate,
								ykey: data.result[r]['u']
							};
						}
						else if(typeof(data.result[r]['u_max'])!=='undefined' ){
							data_com[count] = {
								xkey: currentdate,
								ykey: data.result[r]['u_max'],
								ykey2: data.result[r]['u_min']
							};
						}
						count++;
					}
				}
				//console.log(data_com);
				if(typeof(data_com[0])!=='undefined'){
					if(typeof(data_com[0]['ykey2'])!=='undefined'){
						
						Morris.Area({
							parseTime:false,element: 'graph'+idx+'',
							data: data_com,
							xkey: ['xkey'],
							ykeys: ['ykey', 'ykey2'],
							labels: [label],
							lineColors: [graphColor, graphColor2],
							pointFillColors: ['none'],
							pointSize: 3,
							hideHover: 'auto',
							resize: true
						});
					}
					else {
						Morris.Area({
							parseTime:false,element: 'graph'+idx+'',
							data: data_com,
							xkey: ['xkey'],
							ykeys: ['ykey'],
							labels: [label],
							lineColors: [graphColor],
							pointFillColors: ['none'],
							pointSize: 3,
							hideHover: 'auto',
							resize: true
						});
					}
				}
			}
		});
	}
}

function switchDevice(idx){
	
	if($('#device'+idx+' .panel').hasClass('device-online')){
		var doStatus='Off';
		$('#device'+idx+' .panel').addClass('device-offline').removeClass('device-online');		
		$('#device'+idx+' .mainicon').addClass('icon-inactive').removeClass('icon-active');	
	}
	else {
		var doStatus='On';
		$('#device'+idx+' .panel').removeClass('device-offline').addClass('device-online');		
		$('#device'+idx+' .mainicon').removeClass('icon-inactive').addClass('icon-active');	
	}
	
	req.abort();
	$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd='+doStatus+'&level=0&passcode=',function(){
		setTimeout(function(){ getDevices(); },1000);
	});	
}

function switchScene(idx){

	var doStatus='On';
	$('#device'+idx+' .panel').removeClass('device-offline').addClass('device-online');		
	$('#device'+idx+' .mainicon').removeClass('icon-inactive').addClass('icon-active');	
	
	req.abort();
	$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchscene&idx='+idx+'&switchcmd='+doStatus+'&level=0&passcode=',function(){
		setTimeout(function(){ getDevices(); },1000);
	});	
}

function switchGroup(idx){
	
	if($('#device'+idx+' .panel').hasClass('device-online')){
		var doStatus='Off';
		$('#device'+idx+' .panel').addClass('device-offline').removeClass('device-online');		
		$('#device'+idx+' .mainicon').addClass('icon-inactive').removeClass('icon-active');	
	}
	else {
		var doStatus='On';
		$('#device'+idx+' .panel').removeClass('device-offline').addClass('device-online');		
		$('#device'+idx+' .mainicon').removeClass('icon-inactive').addClass('icon-active');	
	}
	
	req.abort();
	$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchscene&idx='+idx+'&switchcmd='+doStatus+'&level=0&passcode=',function(){
		setTimeout(function(){ getDevices(); },1000);
	});	
}

function slideDevice(idx,status){
	
	if(status>1){
		sliderlist['sl'+idx] = status;
		$('#device'+idx+' .panel').removeClass('device-offline').addClass('device-online');		
		$('#device'+idx+' .mainicon').removeClass('icon-inactive').addClass('icon-active');	
	}
	else {
		$('#device'+idx+' .panel').removeClass('device-offline').addClass('device-online');		
		$('#device'+idx+' .mainicon').removeClass('icon-inactive').addClass('icon-active');	
	}	
	var parentblock = $('#device'+idx);
	var icon = parentblock.find('i.mainicon');
	
	if(typeof(slide)!=='undefined') slide.abort();
	slide = $.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd=Set%20Level&level='+status,function(){
		if(status>1) icon.removeClass('icon-inactive').addClass('icon-active');
		else icon.removeClass('icon-active').addClass('inicon-active');
		sliding = false;
	});	
}

function slideDeviceToggle(idx){
	var parentblock = $('#device'+idx);
	var icon = parentblock.find('i.mainicon');
	if(icon.hasClass('icon-active')){
		$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd=Set%20Level&level=1',function(){
			icon.removeClass('icon-active').addClass('icon-inactive');
		});	
	}
	else {
		$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd=Set%20Level&level='+sliderlist['sl'+idx],function(){
			icon.removeClass('icon-inactive').addClass('icon-active');
		});	
	}
}
