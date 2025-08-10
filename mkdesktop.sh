# Create a desktop entry shortcut for linux.
TRG=$HOME/Desktop/HTML-Snake.desktop
echo [Desktop Entry] > $TRG
echo Type=Application >> $TRG
echo Name=HTML Snake >> $TRG
echo Exec=xdg-open $PWD/snake.html >> $TRG
echo Icon=$PWD/sprites/headw_orig.png >> $TRG
chmod 775 $TRG
