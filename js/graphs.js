function showGraph(idx,title,label,range,current,forced,sensor){
	
	if(typeof(forced)=='undefined') forced=false;
	
	if(typeof(_GRAPHS_LOADED[idx])=='undefined' || _GRAPHS_LOADED[idx]<(time()-600)){
		forced = true;
	}
	
	if(forced){
		_GRAPHS_LOADED[idx] = time();
		realrange=range;
		if(range=='last') realrange='day';
		
		$.ajax({
			url: _HOST_DOMOTICZ+'/json.htm?type=graph&sensor='+sensor+'&idx='+idx+'&range='+realrange+'&time='+new Date().getTime()+'&jsoncallback=?',
			type: 'GET',async: false,contentType: "application/json",dataType: 'jsonp',
			success: function(data) {

				title = title+': <B>'+current+'</B>';
				if(range=='last') title+='<br />'+lang['graph_last_hours']+':';
				if(range=='day') title+='<br />'+lang['graph_today']+':';
				if(range=='month') title+='<br />'+lang['graph_last_month']+':';
				
				var buttons ='<button type="button" class="btn btn-default ';
				if(range=='last') buttons+='active';
				buttons+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'last\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_last_hours']+'</button> ';
				
				buttons+='<button type="button" class="btn btn-default ';
				if(range=='day') buttons+='active';
				buttons+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'day\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_today']+'</button> ';
				
				buttons+='<button type="button" class="btn btn-default ';
				if(range=='month') buttons+='active';
				buttons+='" onclick="showGraph('+idx+',\''+title+'\',\''+label+'\',\'month\',\''+current+'\',true,\''+sensor+'\');">'+lang['graph_last_month']+'</button>';
										
				var html = blocks['graphs'];
				html = str_replace('[TITLE]',title,html);
				html = str_replace('[ID]',idx,html);
				html = str_replace('[BUTTONS]',buttons,html);	
				
				if(data.status=="ERR") alert('Could not load graph!');
				else {
					if($('#device'+idx).length>0){
						$('#device'+idx).replaceWith(html);
					}
					else $('.row.graphs').append(html);
					
					var data_com=new Array();
					var count=0;
					for(r in data.result){
						
						var currentdate = data.result[r].d;
						var currentstamp = strtotime(currentdate);
						var currenttimeLessFour = Math.round((new Date().getTime()) / 1000)-(3600*4);
						
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
					if($('#graph'+idx+'').length>0 && typeof(data_com[0])!=='undefined'){
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
			}
		});
	}
}