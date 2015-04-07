# Dashticz
Alternative dashboard for Domoticz



# Screenshots
http://plaatjesdump.nl/upload/6570bb2afbeab696fc3eeb8261bee636.jpg
http://plaatjesdump.nl/upload/5ef2edcd1f2b6eb6c76547d1331f853e.jpg



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

<b>When Domoticz is updated, it has removed Dashticz?!</b><br />
Unfortunately, this occurs when Dashticz is installed into Domoticz's www-directory.
When Domoticz installs an update, it complete removes the www-directory, before placing the updated version back. Currently, there is no solution for this (except for installing Dashticz on another webserver), you have to re-install Dashticz.




# Changelog
0.93 - 07/04/2015
- Bugs in translations topmenu
- Bug in switches

0.92 - 06/04/2015
- Support for multiple JointSpace-televisions (add comma-separated list of IP's in config)
- Added another extra iconset

0.91 - 18/03/2015
- Support for Cresta TX320
- If in editmode and hide is checked for a chart, it will now be hidden
- Minor changes to Darkoticz-theme

0.90 - 13/03/2015
- Added setting for showing charts in separate tab (or not)

0.89 - 11/03/2015
- Changed topmenu layout
- Graphs in different tab

0.88 - 09/03/2015
- Traffic info (Dutch) from Vid.nl (only when Dashticz is installed on a webserver with PHP)
- Setting for showing (or not) the traffic info from vid.nl
- Fixed wrong count in total MB's of downloading file in NZBget

0.87 - 08/03/2015
- Fix popup css for cameras

0.86 - 07/03/2015
- Current usage of energy/gas meters will be updated more frequently (every minute)
- New setting: refresh intervals for graphs

0.85 - 27/02/2015
- Support for NZBGET

0.84 - 26/02/2015
- Fix voor hidden switches in selected floorplan (wich aren't marked as favorite)
- Extra checks for existing variables

0.83 - 25/02/2015
- Changes to communication with XBMC/Kodi

0.82 - 23/02/2015
- Changed sortorder-variables because of the fact Domoticz-variables not accepting large texts

0.81 - 22/02/2015
- Support for multiple floorplans, select a floorplan in the dropdown next to the versionnumber at the top of the screen
- Support for cameras (will be extended later)

0.80 - 21/02/2015
- Support for Plex Media Server: 'Currently Playing'-block

0.79 - 20/02/2015
- Fixed XBMC 'Currently Playing'-block
- Fixes for JointSpace remote

0.78 - 19/02/2015
- Fixed errors in calling functions before js-files are loaded

0.77 - 19/02/2015
- Fixed slider issues
- Fixed Domoticz-calls

0.76 - 16/02/2015
- HTML of different blocks separated for easier theming
- Bundled JS-functions in separate files

0.75 - 14/02/2015
- Getting latitude/longitude from Domoticz instead of own setting
- Fixes in showing graphs
- CSS fixes

0.74 - 13/02/2015
- Separated Dashticz from Domoticz.

0.73 - 12/02/2015
- Preparions for adding support for televisions with JointSpace-support

0.72 - 10/02/2015
- Added German language

0.71 - 10/02/2015
- Check for genuine language

0.70 - 09/02/2015
- Graph not refreshing correctly

0.69 - 09/02/2015
- Possible fix for showing moon-icon when weather is clear
- Fix for refreshing Buienradar-block

0.68 - 08/02/2015
- Added some debug options
- Not loading xbmc.js if not needed

0.67 - 07/02/2015
- Fix for not showing save-button in settings

0.66 - 07/02/2015
- Fix for showing XBMC block

0.65 - 07/02/2015
- Option (in settings) to show only favorite-blocks from Domoticz
- Add Buienradar-block. Fill in latitude/longitude in Settings.
(If you're not living in the Netherlands, you can hide this block)

0.64 - 03/02/2015
- Possible fix for not hiding blocks

0.63 - 03/02/2015
- Beta functionality to hide blocks, THIS WILL NOT UPDATE DOMOTICZ FAVORITE-LIST!
To activate this, click the green pencil on the top right of the screen and click on the blocks.
DISCLAIMER: Create a test-switch to test with or make a backup of the Domoticz-database.
- Graph css fix in default theme
- Showing all blocks instead of favorite blocks
- Untranslated words added to translation files

0.62 - 02/02/2015
- Beta functionality to sort the blocks, THIS WILL NOT UPDATE DOMOTICZ SORTORDER!
To activate this, click the green pencil on the top right of the screen and start dragging the blocks

0.61 - 02/02/2015
- Moved configuration settings (again, sorry) from cookies to Domoticz-uservars!
- Changed default theme name to 'Default'
- If you have a day/night switch wich shows the day/night icon in the right top of the screen, it doenst have to be set as favorite in Domoticz

0.60 - 02/02/2015
- Color changes for graphs in themes

0.59 - 01/02/2015
- Support for doorbell/locks

0.58 - 01/02/2015
- Fixed empty UV-blocks
- Fixed logo (again)
- Fixed Day/Night icon in the top right of the screen 

0.57 - 01/02/2015
- Removed config.js, settings can be changed in settings-screen (cog-icon on the top right)
-- > Currently settings are saved in a cookie, will find another way in future (probable Domoticz-vars?)

0.56 - 01/02/2015
- Language switch added in settings

0.55 - 02/02/2015
- Added readings for Aeon Labs HEM and Smart Switch/Meter
- Preparing for multiple languages

0.54 - 31/01/2015
- Support for scenes and groups
- Preparing for editing mode (for editing names and icons)

0.53 - 31/01/2015
- added Darkoticz-theme

0.52 - 29/01/2015
- More preparation for theming
- Fix in XBMC-block wich shows what's currently playing
- Small CSS-fixes for settings screen

0.51 - 29/01/2015
- Changed default theme

0.50 - 29/01/2015
- Show last update date
- Preparing for different themes
- Add settings window

0.48 - 28/01/2015
- Disabled locked switches

0.47 - 28/01/2015
- Graph for CPU-temperature fixed (bug in values)

0.46 - 28/01/2015
- Graphs are now showing last hours by default instead of the whole day

0.44 - 27/01/2015
- Sliders added for dimmers
- Graphs support for CPU/Memory

0.36 - 27/01/2015
- CSS changes for smaller screens
- Added extended icon-set (Weather icons)
- Added XBMC-movie-library-menu if XBMC-ip is set

0.31 - 27/01/2015
- Different Wunderground blocks merged in 1 block
- Support for Skycons (animated icons)

0.25 - 26/01/2015
- Basis support for sliders