// JavaScript Document

var blocks = new Object();

//TOP BAR
blocks['topbar'] = '<nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">';
    blocks['topbar']+= '<div class="navbar-header">';
        blocks['topbar']+= '<div class="fl-left">';
        	blocks['topbar']+= '<strong>Domoticz</strong> V<span id="version"></span> | ';
            blocks['topbar']+= '<strong>Dashticz</strong> V<span id="dversion"></span>';
            blocks['topbar']+= '<span id="menu" style="display:none;"> | ';
                blocks['topbar']+= '<a href="javascript:void(0);" onclick="showDashboard();">Dashboard</a> | ';
                blocks['topbar']+= '<a href="javascript:void(0);" onclick="showXbmc();">XBMC</a>';
            blocks['topbar']+= '</span>    ';                
        blocks['topbar']+= '</div>';
    	blocks['topbar']+= '<div class="fl-right">';
        	blocks['topbar']+= '<span id="systeminfo"></span>';
        	blocks['topbar']+= '<span id="sun"></span>';
            blocks['topbar']+= '<span id="settings"><a href="javascript:openSettings();"><i class="fa fa-cog"></i></a></span>';
    	blocks['topbar']+= '</div>';
    blocks['topbar']+= '</div> ';           
blocks['topbar']+= '</nav>';

//NAVIGATION-BLOCK
blocks['navigation'] = '<div class="dropdown-wrap boxed-velvet">';
	blocks['navigation']+= '<ul class="dropdown inner clearfix">';
        blocks['navigation']+= '<li class="first"><a href="#"><i class="fa fa-home fa-2x"></i><span class="menu-item">Dashboard</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-pencil-square-o fa-2x"></i><span>Plattegrond</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-lightbulb-o fa-2x"></i><span>Schakelaars</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-archive fa-2x"></i><span>Groepen</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-umbrella fa-2x"></i><span>Temperatuur</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-cloud fa-2x"></i><span>Weer</span></a></li>';
        blocks['navigation']+= '<li><a href="#"><i class="fa fa-cube fa-2x"></i><span>Overige</span></a></li>';
        blocks['navigation']+= '<li class="last"><a href="#"><i class="fa fa-wrench fa-2x"></i><span>Instellingen</span></a></li>';
    blocks['navigation']+= '</ul>';
blocks['navigation']+= '</div> ';


//GENERAL WRAPPERS FOR BLOCKS ON DASHBOARD
blocks['blocks'] = '<div id="page-wrapper">';
    blocks['blocks']+= '<div class="row dashboard"></div>';
    blocks['blocks']+= '<div class="row xbmc" style="display:none;"></div>'; 
blocks['blocks']+= '</div>';


//SETTINGS BLOCK
blocks['settings'] = '<div class="modal fade" id="settingsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">';
	blocks['settings']+= '<div class="modal-dialog">';
		blocks['settings']+= '<div class="modal-content">';
			blocks['settings']+= '<div class="modal-header">';
				blocks['settings']+= '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
				blocks['settings']+= '<h3 class="modal-title" id="myModalLabel">Settings</h3>';
				blocks['settings']+= '<h5>Change Dashticz the way you want it to be</h5>';
			blocks['settings']+= '</div>';
			blocks['settings']+= '<div class="modal-body">';
			
				blocks['settings']+= '<div class="row">';
					blocks['settings']+= '<label class="col-md-2">Theme</label>';
					blocks['settings']+= '<div class="col-md-10">';
						blocks['settings']+= '<select name="theme" class="form-control">';
							blocks['settings']+= '<option value="default">Default</option>';
							blocks['settings']+= '<option value="darkoticz">Darkoticz</option>';
						blocks['settings']+= '</select>';
					blocks['settings']+= '</div>';
				blocks['settings']+= '</div>';
					
			blocks['settings']+= '</div>';
			blocks['settings']+= '<div class="modal-footer">';
				blocks['settings']+= '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
				blocks['settings']+= '<button type="button" class="btn btn-primary" onclick="saveSettings();">Save</button>';
			blocks['settings']+= '</div>';
		blocks['settings']+= '</div>';
	blocks['settings']+= '</div>';
blocks['settings']+= '</div>';