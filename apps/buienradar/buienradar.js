
function getBuienradar(){
	$.get('apps/buienradar/buienradar.php?time='+new Date().getTime()+'&lat='+_LATITUDE+'&lon='+_LONGITUDE,function(data){
		if(data.substr(0,1)=='['){
			data=$.parseJSON(data);
			var data_radar = new Array();
			for(d in data){
				if(data[d]!==""){
					var rain = data[d].split('|');
					data_radar[d] = {
						xkey: rain[1],
						ykey: rain[0]
					}; 
				}
			}
			
			var html = blocks['buienradar'];
			html = str_replace('[TITLE]','Buienradar',html);
		
			if($('#buienradar').length>0){
				$('#buienradar').replaceWith(html);
			}
			else $('.row.dashboard').first().prepend(html);
			
			if($('#graph_radar').length>0){
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
			}
		}
	});	
}