//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var xbmcplaying;
var xbmcdevice;
var reqxbmc;

var _XBMCSWITCH='';
if(typeof($.cookie('xbmcswitch'))=='undefined' && $.cookie('xbmcswitch')!==""){
	_XBMCSWITCH = $.cookie('xbmcswitch');
}

function loadXBMC(){
	if(_XBMCHOST!==""){
		$('span#menu').show();	
		openXbmcLibrary();
	}
}

$(window).resize(function(){
	if(_XBMCHOST!==""){
		$('.movieitem img.poster').height('auto');
	
		clearTimeout($.data(this, 'resizeTimer'));
    	$.data(this, 'resizeTimer', setTimeout(function() {
    	    checkHeighestPoster();
   		}, 500));
	}
});

function showXbmc(){
	$('.row').show();
	$('.row.dashboard').hide();
	checkHeighestPoster();
}

function checkHeighestPoster(){
	var highestBox = 0;
	$('.movieitem').each(function(){
		if($(this).find('img.poster').height() > highestBox) {
		   highestBox = $(this).find('img.poster').height(); 
		}
	});
	
	$('.movieitem img.poster').height(highestBox);	
}


function openXbmcLibrary(){
	_data = {"jsonrpc": "2.0", "method": "VideoLibrary.GetMovies",  "params": {"sort": {"order": "ascending", "method": "title"}, "properties": ["title", "art"] }, "id": 1};

	$.post(_XBMCHOST,_data,function(data){
		data=$.parseJSON(data);
		for(m in data['result']['movies']){
			if($('#movie'+data['result']['movies'][m]['movieid']).length==0){

				var html='<div class="col-sm-2 movieitem" id="movie'+data['result']['movies'][m]['movieid']+'">';
					html+='<div class="panel">';
						html+='<div class="panel-heading">';
							html+='<img class="poster" width="100%" src="'+decodeURIComponent(data['result']['movies'][m]['art']['poster']).substr(0,decodeURIComponent(data['result']['movies'][m]['art']['poster']).length - 1).replace('image://','').replace('/original/','/w396/')+'" alt="'+data['result']['movies'][m]['label']+' title="'+data['result']['movies'][m]['label']+'"/>';		
						html+='</div>';
						
						html+='<a class="details" href="javascript:playMovie('+data['result']['movies'][m]['movieid']+');">';
							html+='<div class="panel-footer">';
								html+='<span class="pull-left">'+lang['media_play']+'</span>';
								html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
								html+='<div class="clearfix"></div>';
							html+='</div>';
						html+='</a>';
					html+='</div>';
				html+='</div>';
				  
				$('.row.xbmc').append(html);
			}
		}
		
	});
}

function playMovie(ID){
	alert('Not yet implemented!');

	showDashboard();
	getXbmc(xbmcdevice,true);
}

function getXbmc(DEVICE,forceplaying){
	if(typeof(forceplaying)=='undefined') forceplaying=false;
	if(_XBMCHOST!==""){
		if(DEVICE['Name']==_XBMCSWITCH){
			xbmcdevice = DEVICE;
			xbmcplaying=false;
			if(forceplaying || DEVICE['Status']=='On') xbmcplaying=true;

			_data = {"jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "thumbnail", "file", "fanart", "streamdetails"], "playerid": 1 }, "id": "VideoGetItem"};
			if(typeof(reqxbmc)=='undefined'){
				reqxbmc = $.post(_XBMCHOST,_data,function(data){
					data=$.parseJSON(data);
					if(typeof(data['result'])!=='undefined'){
						dis_pause = '';
						dis_play = 'display:none;';
						if(!xbmcplaying){
							dis_pause = 'display:none;';
							dis_play = '';
						}
						
						var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="xbmc-playing">';
							html+='<div class="panel panel-default">';
								html+='<div class="panel-heading">';
									html+='<div class="row">';
										html+='<div class="col-xs-12 text-left">';
											
											if(data['result']['item']['season']<0){
												label = data['result']['item']['label'].split(' - ');
												label[0] = label[0].replace('.avi','').replace('.mkv','');
												html+='<div class="huge">'+label[0]+'</div>';
												if(typeof(label[1])!=='undefined') html+='<div>'+label[1]+'</div>';
												else html+='<div>&nbsp;</div>';
											}
											else {
												html+='<div class="huge">'+data['result']['item']['showtitle']+'</div>';
												html+='<div>S'+data['result']['item']['season']+'E'+data['result']['item']['episode']+' - '+data['result']['item']['label']+'</div>';
											}
											
										html+='</div>';
									html+='</div>';
								html+='</div>';
								
								html+='<a class="details pause" style="'+dis_pause+'" href="javascript:$(\'#xbmc-playing .detail\').toggleClass(\'tile-green\');$(\'#xbmc-playing .detail\').toggleClass(\'tile-orange\');$(\'#xbmc-playing .pause,#xbmc-playing .play\').toggle();switchDevice(51,\'On\');">';
									html+='<div class="panel-footer">';
										html+='<span class="pull-left">'+lang['media_pause']+'</span>';
										html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
										html+='<div class="clearfix"></div>';
									html+='</div>';
								html+='</a>';
							
								html+='<a class="details play" style="'+dis_play+'" href="javascript:$(\'#xbmc-playing .detail\').toggleClass(\'tile-green\');$(\'#xbmc-playing .detail\').toggleClass(\'tile-orange\');$(\'#xbmc-playing .pause,#xbmc-playing .play\').toggle();switchDevice(51,\'Off\');">';
									html+='<div class="panel-footer">';
										html+='<span class="pull-left">'+lang['media_resume']+'</span>';
										html+='<span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>';
										html+='<div class="clearfix"></div>';
									html+='</div>';
								html+='</a>';
							html+='</div>';
						html+='</div>';
						
						if($('#xbmc-playing').length>0){
							$('#xbmc-playing').replaceWith(html);
						}
						else $('.row.dashboard:first').prepend(html);
					}
					delete reqxbmc;		
				});	
			}
		}
	}
}