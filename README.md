# Dashticz
Alternative dashboard for Domoticz



# Screenshots
http://puu.sh/hPj3v/5e70de7d54.png

http://puu.sh/hPjac/ae95338fdb.png


#Getting Started
If you want interaction with your XBMC/Kodi-device, make sure you have a webserver with PHP enabled on a device in your network.

For windows, OSX or Linux, you can try XAMPP (https://www.apachefriends.org/download.html)
If you have a Synology NAS, you are able to enable the webserver in the DiskStation Manager.



#Installation
Before you can use Dashticz, unzip all files to a subfolder in Domoticz or on a webserver (With PHP and cURL) of your choice.
Edit CONFIG.js in the root and insert the IP-address of Domoticz without a trailing slash; e.g.: http://192.168.1.3:8084



#Configuration
To enable communcation with different services/devices, add following lines to CONFIG.js and change the IP-address/port:

(!) = Install dashticz on webserver with PHP-support


For Domoticz:

var _HOST_DOMOTICZ		= 'http://192.168.1.3:8084'; 



For XBMC/Kodi (!):

var _HOST_XBMC			= 'http://192.168.1.109:8080';



For Philips-televisions with JointSpace-support (!):

var _HOST_JOINTSPACE	= 'http://192.168.1.51:1925';

var _HOST_JOINTSPACE	= 'http://192.168.1.51:1925,http://192.168.1.52:1925'; //multiple



For Plex Media Server (!):

var _HOST_PLEX			= 'http://192.168.1.28:32400';



For NZBget:

var _HOST_NZBGET		= 'http://192.168.1.3:6789';




#Donations
If you like Dashticz and want to support the developer, you can always send a small donation with PayPal:

https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=TZ73DJGTCK2NE




# Special thanks
A special THANK YOU, for help, testing, ideas and tips
- Michaël van der Heijden
- Remco van Geel
- Arjan van de Wiel
- Leon G. / Dountill
- Dave Drager



#Frequently Asked Questions
<b>How to use Dashticz if Domoticz is password protected?</b><br />
Open up CONFIG.js in a text-editor (notepad for example).
Fill in the full path for Domoticz, e.g.: http://username:password@192.168.1.3:8084 (withouth trailing slash)

<b>Dashticz shows me a completely white screen!</b><br />
If you open the console-window of your webbrowser, do you see any errors about files that cannot be found?
Try adding the following code to index.html (after <head>): <base href="/DASHTICZ-FOLDER/"> 
Replace DASHTICZ-FOLDER with the exact name of the subfolder Dashticz is in...

<b>When Domoticz is updated, it has removed Dashticz?!</b><br />
Unfortunately, this occurs when Dashticz is installed into Domoticz's www-directory.
When Domoticz installs an update, it complete removes the www-directory, before placing the updated version back. Currently, there is no solution for this (except for installing Dashticz on another webserver), you have to re-install Dashticz.
