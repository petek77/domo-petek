//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var xbmcinteract=false;
var xbmcdevice;
var reqplex;

function loadPLEX(){
	getPlex();
}

function getPlex(){
	if(_HOST_PLEX!==""){
		reqplex = $.ajax({
			url: 'apps/plex/plex.php?url='+encodeURIComponent(_HOST_PLEX+'/status/sessions'),
			type: 'GET', 
			success: function(data){
				data=$.parseJSON(data);
				
				//console.log(data);
			
				if(data!=="{}" && typeof(data['title'])!=='undefined'){
					//_data = {"jsonrpc": "2.0", "method": "Player.GetProperties", "params": { "properties": ["playlistid","speed","position","totaltime","time"], "playerid": 1 }, "id": "VideoGetItem"};
					//reqplex = $.post('apps/kodi/kodi.php?host='+_HOST_XBMC,_data,function(prop){
						//prop=$.parseJSON(prop);
						
						//if(typeof(prop['result'])!=='undefined'){
							dis_pause = '';
							dis_play = 'display:none;';
							//if(data['result']['speed']==0){
								//dis_pause = 'display:none;';
								//dis_play = '';
							//}
							
							var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="plex-playing">';
								html+='<div class="panel panel-default">';
									html+='<div class="panel-heading">';
										html+='<div class="row">';
											html+='<div class="col-xs-12 text-left">';

												if(data['type']=='episode'){
													html+='<div class="huge">'+data['grandparentTitle']+'</div>';
													
													var season = data['parentIndex'];
													if(season<10) season='0'+season;
													var episode = data['index'];
													if(episode<10) episode='0'+episode;
													
													html+='<div>S'+season+'E'+episode+' - '+data['title']+'</div>';
												}
												else {
													html+='<div class="huge">'+data['title']+'</div>';
													html+='<div>'+data['tagline']+'</div>';
												}
											html+='</div>';
										html+='</div>';
									html+='</div>';
									
									var currenttime = '';

									html+='<a class="details pause" style="'+dis_pause+'" href="javascript:playpauseVideo();">';
										html+='<div class="panel-footer">';
											html+='<span class="pull-left"><!--'+lang['media_pause']+'--><div style="font-size:13px;margin-top:-3px">'+currenttime+'</div></span>';
											html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
											html+='<div class="clearfix"></div>';
										html+='</div>';
									html+='</a>';
								
									html+='<a class="details play" style="'+dis_play+'" href="javascript:playpauseVideo();">';
										html+='<div class="panel-footer">';
											html+='<span class="pull-left"><!--'+lang['media_resume']+'--><div style="font-size:13px;margin-top:-3px">'+currenttime+'</div></span>';
											html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
											html+='<div class="clearfix"></div>';
										html+='</div>';
									html+='</a>';
								html+='</div>';
							html+='</div>';
							
							if($('#plex-playing').length>0){
								$('#plex-playing').replaceWith(html);
							}
							else $('.row.dashboard:first').prepend(html);
						//}
						//else {
						//	$('#xbmc-playing').remove();	
						//}
						
					
					//});	
				}
				else {
					$('#plex-playing').remove();	
				}
				setTimeout(function(){ getPlex(); },1000); 
			}
		});	
	}
}