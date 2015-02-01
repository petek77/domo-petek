# Dashticz
Dashboard addon for Domoticz

To install Dashticz, you should have access to the installation directory of Domoticz.
If Domoticz is installed on a Synology NAS, you could create a symbolic link for easier access.
In my case I used to following command through SSH:

mount -o bind /usr/local/domoticz /volume1/Rob/Domoticz/

Once you have access to the directory, create a subfolder named 'dash' (or any other foldername you want) in the www-folder. Extract the files from the ZP-file you've just downloaded into this folder.

In /js/dashticz.js there are some configuration-options you can set.
If you don't want to use the Kodi/XBMC-functions, leave this variable empty.

If you want to interact with Kodi/XBMC, create a PHP-file on a webserver, with the following code and replace the IP-address of Kodi:
http://jsfiddle.net/d2vpuc26/ 

Last but not least, Dashticz is accessible via http://DOMOTICZ_IP:PORT/YOUR_FOLDERNAME/index.html
(Do not forget index.html in the end of the URL. For some reason Domoticz-webserver not automatically opens index.html)

WARNING!!
After a Domoticz-update, you have to re-upload Dashticz.
Domoticz removes the whole folder!


# Screenshots
http://plaatjesdump.nl/upload/314019db2d6725525edfbe7c7db6a92e.jpg


# Special thanks

A special THANK YOU, for help, testing, ideas and tips
- Michaël van der Heijden
- Remco van Geel
- Arjan van de Wiel
- Leon G. / Dountill
- Dave Drager


# Changelog
0.56 - 02/02/2015
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