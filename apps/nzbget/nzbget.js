
function loadNZBGET(){
	_data = {"method": "listgroups", "nocache": new Date().getTime(), "params": [100] };
	NZBGET.rpcUrl = _HOST_NZBGET;
	NZBGET.call(_data,'returnNZBGET');
}

function returnNZBGET(data){
	for(d in data){
		console.log(data[d]);
		
		var html='<div class="col-xs-6 col-sm-4 col-md-3 col-lg-3" id="nzbget-'+data[d]['FirstID']+'">';
			html+='<div class="panel panel-default">';
				html+='<div class="panel-heading">';
					html+='<div class="row">';
						html+='<div class="col-xs-12 text-left">';
								html+='<div class="huge">'+data[d]['NZBName'].substr(0,20)+'...</div>';
								html+='<div>Status: '+data[d]['Status']+'</div>';
							
						html+='</div>';
					html+='</div>';
				html+='</div>';

				html+='<div class="details pause">';
					html+='<div class="panel-footer">';
						html+='<span class="pull-left"></span>';
						html+='<span class="pull-right media"></span>';
						html+='<div class="clearfix"></div>';
					html+='</div>';
				html+='</div>';
				
			html+='</div>';
		html+='</div>';
			
		if($('#nzbget-'+data[d]['FirstID']+'').length>0){
			$('#nzbget-'+data[d]['FirstID']+'').replaceWith(html);
		}
		else $('.row.dashboard:first').prepend(html);
											
	}
}

var NZBGET = (new function($)
{
	'use strict';
	
	// Properties
	this.rpcUrl;
	this.defaultFailureCallback;
	this.connectErrorMessage = 'Cannot establish connection';

	this.call = function(request, completed_callback, failure_callback, timeout)
	{
		request = JSON.stringify(request);
		var _this = this;
		
		//var request = JSON.stringify({nocache: new Date().getTime(), method: method, params: params});
		var xhr = new XMLHttpRequest();

		xhr.open('post', this.rpcUrl);
		
		if (timeout)
		{
			xhr.timeout = timeout;
		}

		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === 4)
			{
				var res = 'Unknown error';
				var result;
				if (xhr.status === 200)
				{
					if (xhr.responseText != '')
					{
						try
						{
							result = JSON.parse(xhr.responseText);
						}
						catch (e)
						{
							res = e;
						}
						if (result)
						{
							if (result.error == null)
							{
								res = result.result;
								eval(completed_callback+'(res)');;
								return;
							}
							else
							{
								res = result.error.message + '<br><br>Request: ' + request;
							}
						}
					}
					else
					{
						res = 'No response received.';
					}
				}
				else if (xhr.status === 0)
				{
					res = _this.connectErrorMessage;
				}
				else
				{
					res = 'Invalid Status: ' + xhr.status;
				}

				if (failure_callback)
				{
					failure_callback(res, result);
				}
				else
				{
					_this.defaultFailureCallback(res, result);
				}
			}
		};
		xhr.send(request);
	}
}(jQuery));