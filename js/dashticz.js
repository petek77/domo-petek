
//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var req;
var slide;
var sliding = false;
var dashticz_version='0.81';
var temperatureBlock=new Object();
var sliderlist = new Object();
var alldevices = new Object();
var uservars = new Object();
var showNavigation;

var _LANGUAGE='en_US';
var _THEME='default';
//var _XBMCSWITCH='';
var _DAY=false;

var _LATITUDE='';
var _LONGITUDE = '';

var _BLOCKSORDER = false;
var _BLOCKSHIDE = new Object();
var _FAVORITES=0;
var _DEBUG=false;

var _DEBUG_JSON = '';
var _GRAPHS_LOADED = new Object();


$(document).ready(function(){
	
	$.getScript( 'CONFIG.js',function(){
		//_HOST_XBMC = encodeURIComponent(_HOST_XBMC);
		
		$.getScript( 'js/functions.js',function(){
			if(_HOST_DOMOTICZ=='') alert('Fill in the path to Domoticz in CONFIG.js!!');
			else {
				
				$.ajax({
					url: _HOST_DOMOTICZ+'/json.htm?type=command&param=getSunRiseSet&jsoncallback=?',
					type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
					success: function(data) {
			
						if(time()>=strtotime(date('Y-m-d ')+data.Sunrise) && time()<=strtotime(date('Y-m-d ')+data.Sunset)){
							_DAY=true;
						}
						
						$.ajax({
							url: _HOST_DOMOTICZ+'/json.htm?type=command&param=getuservariables&jsoncallback=?',
							type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
							success: function(data) {
								for(r in data.result){
									uservars[data.result[r]['Name']] = data.result[r];
								}
								
								if(typeof(uservars['dashticz_blockorder'])!=='undefined'){
									_BLOCKSORDER = uservars['dashticz_blockorder']['Value'].split(',');
								}
								
								if(typeof(uservars['dashticz_blockhide'])!=='undefined'){
									_BLOCKSHIDE = $.parseJSON(uservars['dashticz_blockhide']['Value'].split(','));
								}
								
								if(typeof(uservars['dashticz_language'])!=='undefined') _LANGUAGE = uservars['dashticz_language']['Value'];
								if(typeof(uservars['dashticz_theme'])!=='undefined') _THEME = uservars['dashticz_theme']['Value'];
								if(typeof(uservars['dashticz_onlyfavorites'])!=='undefined') _FAVORITES = uservars['dashticz_onlyfavorites']['Value'];
								//if(typeof(uservars['dashticz_xbmcswitch'])!=='undefined') _XBMCSWITCH = uservars['dashticz_xbmcswitch']['Value'];
								
								if(_LANGUAGE!=='en_US' && _LANGUAGE!=='nl_NL' && _LANGUAGE!=='de_DE'){
									_LANGUAGE='en_US';	
								}
								
								$.getScript( 'js/languages/'+_LANGUAGE+'.js',function(){
									if(typeof(_HOST_XBMC)!=='undefined' && _HOST_XBMC!=='') $.getScript( 'apps/kodi/kodi.js');
									if(typeof(_HOST_PLEX)!=='undefined' && _HOST_PLEX!=='') $.getScript( 'apps/plex/plex.js');
									if(typeof(_HOST_JOINTSPACE)!=='undefined' && _HOST_JOINTSPACE!=='') $.getScript( 'apps/jointspace/jointspace.js');
					
									$.getScript( 'js/blocks.js',function(){
										$.getScript( 'js/graphs.js');
										$.getScript( 'js/settings.js');
										$.getScript( 'js/edit.js');
										$.getScript( 'js/switches.js');
										
										$.getScript( 'themes/'+_THEME+'/js/config.js',function(){
											$.getScript( 'themes/'+_THEME+'/js/blocks.js',function(){
											
												$('div#wrapper').append(blocks['topbar']);
												$('div#wrapper').append(blocks['blocks']);
												if(showNavigation) $('div#wrapper').append(blocks['navigation']);
												$('div#wrapper').append(blocks['settings']);
												
												if(_HOST_XBMC!=='' || _HOST_JOINTSPACE!==''){
													$('span#menu').show();	
												}
												
												$('span#dversion').html(dashticz_version);
									
												$('link#themecss').attr('href','themes/'+_THEME+'/css/style.css');
												$('img#logo').attr('src','themes/'+_THEME+'/images/logo.png');
												
												$.ajax({
													url: _HOST_DOMOTICZ+'/json.htm?type=command&param=getversion&jsoncallback=?',
													type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
													success: function(data) {
														$('span#version').html(data.version);
													}
												});
												
												if(_DAY) var html = '<span id="dayornight"><i class="fa fa-sun-o"></i></span>';
												else var html = '<span id="dayornight"><i class="fa fa-moon-o"></i></span>';
												
												if($('#dayornight').length>0) $('#dayornight').replaceWith(html);
												else $('#sun').append(html);
								
												if(_HOST_XBMC!=="") loadXBMC();
												if(_HOST_PLEX!=="") loadPLEX();
												autoGetDevices();
											});
										});
									});
								});
							}
						});
					}
				});
			}
		});
	});
});

function switchTheme(theme){
	$('link#theme').attr('href','themes/'+theme+'/css/style.css');	
	if(typeof(uservars['dashticz_theme'])=='undefined'){
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=command&param=saveuservariable&vname=theme&vtype=2&vvalue='+theme+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				
			}
		});
	}
	else {
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_theme']['idx']+'&vname=theme&vtype=2&vvalue='+theme+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				
			}
		});
	}
}

function setFloorplan(idx){
	if(typeof(uservars['dashticz_currentfloorplan'])=='undefined'){
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=command&param=saveuservariable&vname=dashticz_currentfloorplan&vtype=2&vvalue='+idx+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				window.location.reload();
			}
		});
	}
	else {
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=command&param=updateuservariable&idx='+uservars['dashticz_currentfloorplan']['idx']+'&vname=dashticz_currentfloorplan&vtype=2&vvalue='+idx+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				window.location.reload();
			}
		});
	}
	
}

function autoGetDevices(){
	
	/*
	//http://192.168.1.3:8084/json.htm?type=command&param=getplandevices&idx=3
	
	
	$.ajax({
		url: _HOST_DOMOTICZ+'/json.htm?type=plans&displayhidden=1&jsoncallback=?',
		type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
		success: function(data) {
			if(typeof(data.result)=='undefined'){
				$('.floorplans').hide();
			}
			else {
				$('.floorplans').show();
				$('.floorplans select').html('');
				$('.floorplans select').append('<option value="0"></option>');
				for(r in data.result){
					var sel='';
					if(typeof(uservars['dashticz_currentfloorplan'])!=='undefined' && uservars['dashticz_currentfloorplan']['Value']==data.result[r]['idx']){
						sel='selected';	
					}
					
					$('.floorplans select').append('<option value="'+data.result[r]['idx']+'" '+sel+'>'+data.result[r]['Name']+'</option>');
				}
			}
		}
	});
	*/
	$('.cameras').hide();
	$.ajax({
		url: _HOST_DOMOTICZ+'/json.htm?type=cameras&jsoncallback=?',
		type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
		success: function(data) {
			if(typeof(data.result)=='undefined'){
				//openCamera(0,'Camera');
				//$('.cameras').hide();
			}
			else {
				//$('.cameras').show();
				//$('.cameras select').html('');
				//$('.cameras select').append('<option value="0"></option>');
				for(r in data.result){
					openCamera(data.result[r]['idx'],data.result[r]['Name']);
					//$('.cameras select').append('<option value="'+data.result[r]['idx']+'-">'+data.result[r]['Name']+'</option>');
				}
			}
		}
	});
	
	$.ajax({
		url: _HOST_DOMOTICZ+'/json.htm?type=floorplans&jsoncallback=?',
		type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
		success: function(data) {
			if(typeof(data.result)=='undefined'){
				$('.floorplans').hide();
			}
			else {
				$('.floorplans').show();
				$('.floorplans select').html('');
				$('.floorplans select').append('<option value="0"></option>');
				for(r in data.result){
					var sel='';
					if(typeof(uservars['dashticz_currentfloorplan'])!=='undefined' && uservars['dashticz_currentfloorplan']['Value']==data.result[r]['idx']){
						sel='selected';	
					}
					
					$('.floorplans select').append('<option value="'+data.result[r]['idx']+'" '+sel+'>'+data.result[r]['Name']+'</option>');
				}
			}
		}
	});
	
	getDevices();
	setTimeout(function(){ autoGetDevices (); },60000);
}

function openCamera(idx,name){

	var camera='';
	camera='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="camera'+idx+'">';
		camera+='<div class="panel panel-block panel-default" data-idx="'+idx+'">';
			camera+='<div class="panel-heading">';
				camera+='<div class="row">';
						camera+='<div class="col-xs-8">';
							camera+='<div class="huge">'+name+'</div>';
							//camera+='<div>'+name+'</div>';
						camera+='</div>';
						camera+='<div class="col-xs-4 text-right icon">';
							camera+='<div><img style="height:62px;" src="'+_HOST_DOMOTICZ+'/camsnapshot.jpg?idx='+idx+'&count=0?t='+new Date().getTime()+'" /></div>';
							//camera+='<div><img style="height:62px;" src="http://images.webcams.travel/webcam/1341948018-Weer-Live-New-York-traffic-web-cam-in-Broadway-@-Vesey-St-in-NYC-Manhattan.jpg" /></div>';
						camera+='</div>';
				
					camera+='</div>';
			camera+='</div>';
			camera+='<a href="javascript:alert(\'Live View is not yet implemented...\')">';
				camera+='<div class="panel-footer">';
					camera+='<span class="pull-left">'+lang['view']+'</span>';
					camera+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
					camera+='<div class="clearfix"></div>';
				camera+='</div>';
			camera+='</a>';
		camera+='</div>';
	camera+='</div>';
	
	if($('#camera'+idx).length>0){
		$('#camera'+idx).replaceWith(camera);
	}
	else $('.row.dashboard').append(camera);
	
}

function getDevices(){
	var floorplan='';
	if(typeof(uservars['dashticz_currentfloorplan'])!=='undefined' && parseFloat(uservars['dashticz_currentfloorplan']['Value'])>0){
		floorplan='&floor='+uservars['dashticz_currentfloorplan']['Value'];
	}
	
	if(!sliding){
		if(typeof(req)!=='undefined') req.abort();
		req = $.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=devices&filter=all&used=true&order=Name'+floorplan+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {
				if(_DEBUG) data = _DEBUG_JSON;
				if(typeof(data.Latitude)!=='undefined') _LATITUDE = data.Latitude;
				if(typeof(data.Longitude)!=='undefined') _LONGITUDE = data.Longitude;
				
				for(r in data.result){
					alldevices[data.result[r]['idx']] = data.result[r];
					//if(_HOST_XBMC!=="") getXbmc(data.result[r]);
								
					if(
						(
							(_FAVORITES==1 && data.result[r]['Favorite']==1) || 
							_FAVORITES==0
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
								
								var html = '';
								var setslide='';
								var element = data.result[r];							
								
								if(element['SwitchType']=='Push On Button' || element['SwitchType']=='On/Off' || element['SwitchType']=='Doorbell' || element['SwitchType']=='Door Lock' || element['Type']=='Scene' || element['Type']=='Group'){
									if(element['Protected'] == true){
										var html = blocks['protected'];
									}
									else if(element['Type']=='Scene') {
										var html = blocks['scene'];
									}
									else if(element['SwitchType']=='Doorbell' || element['SwitchType']=='Push On Button' || element['SwitchType']=='Door Lock') {
										var html = blocks['pushbutton'];
									}
									else if(element['Type']=='Group') {
										var html = blocks['group'];
									}
									else{
										var html = blocks['switch'];
									}
								}
								else if(element['SwitchType']=='Dimmer'){
									var html = blocks['dimmer'];
									var setslide = 'sl'+element['idx'];
								}
								else{// if(element['TypeImg']!=='temperature') {
									var html = blocks['noswitch'];
								}
								
								
								var icon='';		
								if(element['Image']=='Media'){
									icon='fa fa-play-circle-o';
								}
								else if(element['Type']=='Scene' || element['Type']=='Group' || element['Image']=='Light') icon='fa fa-lightbulb-o';
								else if(element['Image']=='Heating') icon='fa fa-fire';
								else if(element['TypeImg']=='temperature') icon='wi wi-thermometer';
								else if(element['SubType']=='Solar Radiation') icon='fa fa-sun-o';
								else if(element['Type']=='Rain') icon='fa fa-umbrella';
								else if(element['Type']=='Wind') icon='fa fa-location-arrow';
								
								var headingclass='';
								if(element['TypeImg']=='temperature') headingclass=' nodetails';
								
								if(element['SwitchType']=='Dimmer'){
									var name = element['Name'];
									var level = element['Level'];
								}
								else {
									if(element['Name']=='jointspace-TV Schakelaar'){
										var name='TV Schakelaar';
									}
									else {
										var name=element['Name'];
									}
									var level = '';
								}
									
								html = str_replace('[IDX]',element['idx'],html);
								html = str_replace('[NAME]',name,html);
								html = str_replace('[CURRENT]',current,html);
								html = str_replace('[LEVEL]',level,html);
								html = str_replace('[ICON]',icon,html);
								html = str_replace('[ICONCLASS]',iconclass,html);
								html = str_replace('[HEADERCLASS]',headingclass,html);
								html = str_replace('[DEVICEACTIVE]',deviceactive,html);
								html = str_replace('[SWITCH_FUNCTION]','switchDevice',html);
								html = str_replace('[LANG_SWITCH]',lang['switch'],html);
								html = str_replace('[LANG_LOCKED]',lang['locked'],html);
								html = str_replace('[LANG_TURNON]',lang['turn_on'],html);
								html = str_replace('[LANG_ACTIVATE]',lang['activate'],html);
								html = str_replace('[CURRENT_DATE]',currentdate,html);
	
								if($('#device'+element['idx']).length>0){
									$('#device'+element['idx']).replaceWith(html);
								}
								else $('.row.dashboard').append(html);
							}
							
							if(setslide!==''){
								initSlider(setslide,element);
								setslide='';
							}
				
						}
					}
				}
				
				if(typeof(temperatureBlock['Wunderground'])!=='undefined'){
					var wg = temperatureBlock['Wunderground'];
					var html = blocks['wunderground'];
					
					var content = '';
					if(typeof(wg['Rain'])!=='undefined') content+='Rain: '+wg['Rain']+'mm<br />';
					if(typeof(wg['Gust'])!=='undefined') content+='Gust: '+wg['Gust']+', '+wg['Direction']+'<br />';
					if(typeof(wg['Humidity'])!=='undefined') content+='Pressure: '+wg['Pressure']+', '+wg['Humidity']+'<br />';
										
					html = str_replace('[TITLE]',wg['Temp'],html);
					html = str_replace('[CONTENT]',content,html);
					
					var icon = 'fa-umbrella';
					if((typeof(wg['Rain'])!=='undefined' && wg['Rain']>0) || stristr(wg['Forecast'], 'rain')){
						var iconclass = 'Skycons.RAIN';
					}
					else if(stristr(wg['Forecast'], 'Partly Cloudy')){
						if(_DAY) var iconclass = 'Skycons.PARTLY_CLOUDY_DAY';
						else var iconclass = 'Skycons.PARTLY_CLOUDY_NIGHT';
					}
					else if(stristr(wg['Forecast'],'sunny') || stristr(wg['Forecast'],'clear')){
						if(_DAY) var iconclass = 'Skycons.CLEAR_DAY';
						else var iconclass = 'Skycons.CLEAR_NIGHT';
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
					
					if($('#wunderground').length>0){
						$('#wunderground').replaceWith(html);
					}
					else $('.row.dashboard').first().prepend(html);
					
					var skycons = new Skycons({"color": "#ccc"});
					skycons.add("icon_wg", eval(iconclass));
					skycons.play();
				}
					
				if(_LATITUDE!=="" && _LONGITUDE!==""){
					$.getScript( 'apps/buienradar/buienradar.js',function(){
						getBuienradar();
					});
				}
				
				for(bo in _BLOCKSORDER){
					var clone = $('#'+_BLOCKSORDER[bo]);
					var parent = $('#'+_BLOCKSORDER[bo]).parent();
					$('#'+_BLOCKSORDER[bo]).remove();
					parent.append(clone);
				}
			}
		});
	}
}

function initSlider(setslide,element){
	setTimeout(function(){
		var current = parseFloat($('#'+setslide).val());
	if(element['Type'] == 'Lighting Limitless/Applamp'){
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
	},1000);
}
function showDashboard(){
	$('.row').show();
	$('.row.xbmc').hide();
	$('.row.remote').hide();
}