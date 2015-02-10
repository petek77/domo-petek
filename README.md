# Dashticz
Alternative dashboard for Domoticz




# Screenshots
http://plaatjesdump.nl/upload/6570bb2afbeab696fc3eeb8261bee636.jpg
http://plaatjesdump.nl/upload/5ef2edcd1f2b6eb6c76547d1331f853e.jpg




#Installation
To install Dashticz, you should have access to the installation directory of Domoticz.
If Domoticz is installed on a Synology NAS, you could create a symbolic link for easier access.
In my case I used to following command through SSH:

mount -o bind /usr/local/domoticz /volume1/Rob/Domoticz/

Once you have access to the directory, create a subfolder named 'dash' (or any other foldername you want) in the www-folder. Extract the files from the ZIP-file you've just downloaded into this folder.

If you want to interact with Kodi/XBMC, create a PHP-file on a webserver, with the following code and replace the IP-address of Kodi:
http://jsfiddle.net/d2vpuc26/ 

Last but not least, Dashticz is accessible via http://DOMOTICZ_IP:PORT/YOUR_FOLDERNAME/index.html
(Do not forget index.html in the end of the URL. For some reason Domoticz-webserver not automatically opens index.html)

WARNING!! WARNING!! WARNING!! WARNING!!
After a Domoticz-update, you have to re-upload Dashticz.
Domoticz removes the whole folder!




# Special thanks
A special THANK YOU, for help, testing, ideas and tips
- Michaël van der Heijden
- Remco van Geel
- Arjan van de Wiel
- Leon G. / Dountill
- Dave Drager




#Frequently Asked Questions
<b>How do I get the day/night icon in the top right of the screen?</b><br />
In Domoticz, add a dummy switch with a name of your choice. Set a timer so it goes on at sunrise and goes out on sunset.
Fill in the name of this dummy switch in Dashticz's settings.

<b>How to use Dashticz if Domoticz is password protected?</b><br />
Go to Dashticz's settings via the cog-icon in the top right of the screen.
Fill in the full path for Domoticz, e.g.: http://username:password@192.168.1.3:8084 (withouth trailing slash)

<b>When Domoticz is updated, it has removed Dashticz?!</b><br />
Unfortunately, Dashticz has to be installed into Domoticz's www-directory.
When Domoticz installs an update, it complete removes the www-directory, before placing the updated version back. Currently, there is no solution for this, youhave to re-install Dashticz.





# Changelog
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