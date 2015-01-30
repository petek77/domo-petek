//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var req;
var slide;
var sliding = false;
var dashticz_version='0.52';
var temperatureBlock=new Object();
var sliderlist = new Object();

$(document).ready(function(){
	if(typeof($.cookie('theme'))=='undefined') $.cookie('theme','default');
	
    $('#jsscripts').before('<script src="js/config.js"></script>');
    $('#jsscripts').before('<script src="js/blocks.js"></script>');
    $('#jsscripts').before('<script src="js/functions.js"></script>');
    $('#jsscripts').before('<script src="js/xbmc.js"></script>');
	
	$('link#themecss').attr('href','themes/'+$.cookie('theme')+'/css/style.css');
    $('#jsscripts').before('<script src="themes/'+$.cookie('theme')+'/js/config.js"></script>');
    $('#jsscripts').before('<script src="themes/'+$.cookie('theme')+'/js/blocks.js"></script>');
    
    $('div#wrapper').append(blocks['topbar']);
    $('div#wrapper').append(blocks['blocks']);
    if(showNavigation) $('div#wrapper').append(blocks['navigation']);
	$('div#wrapper').append(blocks['settings']);
	
	$('span#dversion').html(dashticz_version);
	$.get(_DOMOTICZHOST+'/json.htm?type=command&param=getversion',function(data){
		data=$.parseJSON(data);
		$('span#version').html(data.version);
	});
	
	autoGetDevices();
});

function openSettings(){
	$('#settingsModal').modal('show');	
}

function saveSettings(){
	$('#settingsModal select,#settingsModal input').each(function(){
		$.cookie($(this).attr('name'),$(this).val());
	});
	setTimeout(function(){ document.location.href=document.location.href; },1000);
}

function switchTheme(theme){
	$('link#theme').attr('href','themes/'+theme+'/css/style.css');
	$.cookie('theme', theme);
}

function autoGetDevices(){
	getDevices();
	setTimeout(function(){ autoGetDevices (); },60000);
}

function getDevices(){
	if(!sliding){
		if(typeof(req)!=='undefined') req.abort();
		req = $.get(_DOMOTICZHOST+'/json.htm?type=devices&filter=all&used=true&order=Name',function(data){
			data=$.parseJSON(data);
			for(r in data.result){
				
				getXbmc(data.result[r]);
							
				if(data.result[r]['Favorite']==1){
					
					  if(typeof(data.result[r]['CounterToday'])!=='undefined') var current='vandaag '+data.result[r]['CounterToday'];
					  else if(typeof(data.result[r]['Usage'])!=='undefined') var current=data.result[r]['Usage'];
					  else if(typeof(data.result[r]['Rain'])!=='undefined') var current=data.result[r]['Rain']+'mm';
					  else if(typeof(data.result[r]['Status'])!=='undefined') var current=data.result[r]['Status'];
					  else if(data.result[r]['TypeImg']=='temperature'){
						  var current=data.result[r]['Data'].split(' ');
						  current = current[0]+'&deg;';
					  }
					  else var current=data.result[r]['Data'];
					
					if(data.result[r]['SubType']=='Energy'){
						current = 'nu '+data.result[r]['Usage']+', '+current;
					}
					if(data.result[r]['SwitchType']=='Dimmer'){
						
						current = data.result[r]['Level']+'%';
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
					
					
					if(
						data.result[r]['SubType']=='Energy' ||
						data.result[r]['SubType']=='Gas'
					){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],'Usage','last',current,false,'counter');
					}
					else if (data.result[r]['HardwareName']=='Motherboard' && data.result[r]['Type']=='Temp'){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],'Temperature','last',current,false,'temp');
					}
					else if (data.result[r]['HardwareName']=='Motherboard' && (stristr(data.result[r]['Name'],'cpu') || stristr(data.result[r]['Name'],'hdd') || stristr(data.result[r]['Name'],'geheugen') || stristr(data.result[r]['Name'],'memory'))){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],'Percentage','last',current,false,'Percentage');
					}
					else if(
						data.result[r]['SubType']=='Solar Radiation'
					){
						showGraph(data.result[r]['idx'],data.result[r]['Name'],'Radiation','last',current,false,'counter');
					}
					else if(
						data.result[r]['Name']==_SUNSWITCH
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
						else if(!sliding){
							var currentdate = '<span class="small">Update: '+date('d-m H:i',strtotime(data.result[r]['LastUpdate']))+'</span>';
							
							var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="device'+data.result[r]['idx']+'">';
								html+='<div class="panel panel-block panel-default">';
									html+='<div class="panel-heading';
									if(data.result[r]['TypeImg']=='temperature') html+=' nodetails';
									html+='">';
										html+='<div class="row">';
											html+='<div class="col-xs-8">';
												if(data.result[r]['SwitchType']=='Dimmer'){
													html+='<div>'+data.result[r]['Name']+' ('+current+')</div>';
													html+='<div>';
													html+='<input type="text" class="span2" value="'+data.result[r]['Level']+'" id="sl'+data.result[r]['idx']+'" >';
													html+='</div>'
												}
												else if(data.result[r]['TypeImg']=='temperature'){
													html+='<div class="huge">'+current+'</div>';
													html+='<div class="small">'+data.result[r]['Name']+'</div>';
												}
												else {
													html+='<div>'+data.result[r]['Name']+'</div>';
												}
											html+='</div>';
											html+='<div class="col-xs-4 text-right icon">';
											
												var icon='';
												
												if(data.result[r]['Image']=='Media'){
													icon='fa fa-play-circle-o';
												}
												else if(data.result[r]['Image']=='Light') icon='fa fa-lightbulb-o';
												else if(data.result[r]['Image']=='Heating') icon='fa fa-fire';
												else if(data.result[r]['TypeImg']=='temperature') icon='wi wi-thermometer';
												else if(data.result[r]['SubType']=='Solar Radiation') icon='fa fa-sun-o';
												else if(data.result[r]['Type']=='Rain') icon='fa fa-umbrella';
												else if(data.result[r]['Type']=='Wind') icon='fa fa-location-arrow';
												
												if(
													(data.result[r]['Status']!=='Off' && parseFloat(data.result[r]['Level'])>0) || 
													data.result[r]['Status']=='On' ||
													parseFloat(data.result[r]['Rain'])>0
												){
													var iconclass = 'icon-active';
												}
												else {
													var iconclass = 'icon-inactive';
												}
												
												html+='<i class="mainicon '+icon+' '+iconclass+'"></i>';
												
											html+='</div>';
										html+='</div>';
									html+='</div>';
									
									var setslide='';
									if(data.result[r]['SwitchType']=='On/Off'){
										if(data.result[r]['Protected'] == true){
											html+='<div class="panel-footer">';
											html+='<span class="pull-left">Locked'+currentdate+'</span>';
											html+='<span class="pull-right"><i class="fa fa-lock"></i></span>';
											html+='<div class="clearfix"></div>';
										}
										else{
											html+='<a href="javascript:switchDevice('+data.result[r]['idx']+',\''+data.result[r]['Status']+'\');">';
												html+='<div class="panel-footer">';
													html+='<span class="pull-left">Switch'+currentdate+'</span>';
													html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
													html+='<div class="clearfix"></div>';
												html+='</div>';
											html+='</a>';
										}
									}
									else if(data.result[r]['SwitchType']=='Dimmer'){
										html+='<a href="javascript:slideDeviceToggle('+data.result[r]['idx']+');">';
											html+='<div class="panel-footer">';
												html+='<span class="pull-left">Switch'+currentdate+'</span>';
												html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
												html+='<div class="clearfix"></div>';
											html+='</div>';
										html+='</a>';
										var setslide = 'sl'+data.result[r]['idx'];
									}
									else if(data.result[r]['TypeImg']!=='temperature') {
										html+='<a href="javascript:javascript:void(0);">';
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
									slideDevice($(this).attr('id').substr(2),ev.value);
								});
							}
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
				else $('.row.dashboard').prepend(html);
				
				var skycons = new Skycons({"color": "#ccc"});
  				skycons.add("icon_wg", eval(iconclass));
				skycons.play();
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
                    html+='<div class="panel panel-default">';
                        html+='<div class="panel-heading graph"><div class="pull-left">';
                            html+=title+': <B>'+current+'</B>';
							if(range=='last') html+='<br />Last hours:';
							if(range=='day') html+='<br />Today:';
							if(range=='week') html+='<br />Last week:';
							if(range=='month') html+='<br />Last month:';
                            html+='</div><div class="pull-right">';
                                html+='<div class="btn-group">';
                                   
									html+='<button type="button" class="btn btn-default ';
									if(range=='last') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'last\',\''+current+'\',true,\''+sensor+'\');">Last</button> ';
									
									html+='<button type="button" class="btn btn-default ';
									if(range=='day') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'day\',\''+current+'\',true,\''+sensor+'\');">Day</button> ';
									
									html+='<button type="button" class="btn btn-default ';
									if(range=='month') html+='active';
									html+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'month\',\''+current+'\',true,\''+sensor+'\');">Month</button>';
                                html+='</div>';
                            html+='</div><div class="clearfix"></div>';
                        html+='</div>';
                        html+='<div class="panel-body">';
                            html+='<div id="graph'+idx+'"></div>';
                        html+='</div>';
                    html+='</div>';
                html+='</div>';
            html+='</div>';
			
			if($('#device'+idx).length>0){
				$('#device'+idx).replaceWith(html);
			}
			else $('.row.dashboard:last').after(html);
			
			data=$.parseJSON(data);
			var data_com=new Array();
			var count=0;
			for(r in data.result){
				
				var currentdate = data.result[r]['d'];
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
					count++;
				}
			}
			//console.log(data_com);
			Morris.Area({
				parseTime:false,element: 'graph'+idx+'',
				data: data_com,
				xkey: ['xkey'],
				ykeys: ['ykey'],
				labels: [label],
				lineColors: ['#ccc'],
				pointSize: 3,
				hideHover: 'auto',
				resize: true
			});

		});
	}
}

function switchDevice(idx,status){
	if(status=='Off') var doStatus='On';
	if(status=='On') var doStatus='Off';
	req.abort();
	$.get(_DOMOTICZHOST+'/json.htm?type=command&param=switchlight&idx='+idx+'&switchcmd='+doStatus+'&level=0&passcode=',function(){
		setTimeout(function(){ getDevices(); },1000);
	});	
}

function slideDevice(idx,status){
	var parentblock = $('#device'+idx);
	var icon = parentblock.find('i.mainicon');
	
	if(typeof(slide)!=='undefined') slide.abort();
	if(status>1) sliderlist['sl'+idx] = status;
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