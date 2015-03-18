//DON'T TOUCH, UNLESS YOU KNOW WHAT YOU ARE DOING
var reqvid;

function loadVID(){
	getVid();
}

function getVid(){
	$.ajax({
		url: 'apps/vid/vid.php',
		type: 'GET', 
		success: function(data){
			if(data.length<4){
				var html = '<span class="fa-stack">';
				html+='<a href="javascript:void(0);" class="notelink" data-toggle="modal" data-target="#trafficinfo"><i class="fa fa-car fa-stack-1x"></i>';
				html+='<i class="fa fa-stack-1x text-danger" style="margin-left:22px;margin-top: -5px; color:red;font-size:12px;font-weight:bold">'+data+'&nbsp;&nbsp;</i>';
				html+='</a>';
				html+='</span>';
				$('#traffic').html(html);
				
				if($('#trafficinfo').length==0 || !$('#trafficinfo').is(':visible')){
					$.ajax({
						url: 'apps/vid/vidinfo.php',
						type: 'GET', 
						success: function(data){
							var vidmodal ='<div class="modal fade" id="trafficinfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
								vidmodal+='<div class="modal-dialog" style="width:700px;">';
									vidmodal+='<div class="modal-content">';
										vidmodal+='<div class="modal-header">';
											vidmodal+='<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
											vidmodal+='<h4 class="modal-title" id="myModalLabel">Verkeersinformatie</h4>';
										vidmodal+='</div>';
										vidmodal+='<div class="modal-body" style="height:400px;overflow-y:auto;">';
											vidmodal+=data;
										vidmodal+='</div>';
										vidmodal+='<div class="modal-footer">';
											vidmodal+='<button type="button" class="btn btn-default" data-dismiss="modal">Sluiten</button>';
										vidmodal+='</div>';
									vidmodal+='</div>';
								vidmodal+='</div>';
							vidmodal+='</div>';
							
							if($('#trafficinfo').length>0){
								$('#trafficinfo').replaceWith(vidmodal);
							}
							else{
								$('body').append(vidmodal);
							}
			
						}
					});	
				}
				
				setTimeout(function(){ getVid(); },60000); 
			}
		}
	});	
}