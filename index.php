<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Големи бомби</title>
        <link rel="stylesheet" type="text/css" href="files/css/ui-darkness/jquery-ui-1.10.0.custom.min.css" />
        <!--<link rel="stylesheet" type="text/css" href="files/css/jquery.sbscroller.css" />-->
        <link rel="stylesheet" type="text/css" href="files/css/jquery.terminal.css" />
        <link rel="stylesheet" type="text/css" href="files/css/site.css" />
        <script src="files/js/jquery.min.js"></script>
        <script src="files/js/jquery-ui-1.10.0.custom.min.js"></script>
        <script src="files/js/jquery.mousewheel.js"></script>
        <script src="files/js/jquery.sbscroller.js"></script>
        <script src="files/js/jquery.terminal-0.4.22.js"></script>
        <script src="files/js/jquery.imageloader.min.js"></script>
        <script src="files/js/kinetic-v4.3.3.min.js"></script>
        <script src="files/js/application/utilities.js"></script>
        <script src="files/js/application/settings.js"></script>
        <script src="files/js/application/map.js"></script>
        <script src="files/js/application/market.js"></script>
        <script src="files/js/application/terminal.js"></script>
        <script src="files/js/application/unit.js"></script>
        <script src="files/js/application/application.js"></script>
<!--        <script src="files/js/site/commandintereter.js"></script>
        <script src="files/js/site/cmd.js"></script>
        <script src="files/js/site/screen.js"></script>
        <script src="files/js/site/unit.js"></script>
        <script src="files/js/site/widgets.js"></script>
        <script src="files/js/site.js"></script>-->
    </head>
    <body>
        <div id="site">
            <div id="application">
                <div id="battlefield-container" class="widget"></div>
                
                <div id="navigation" class="widget">
                    <canvas id="minimap"></canvas>
                    <button id="button-info"><img src="files/img/game/icons/info.png" /></button>
                    <button id="button-fame"><img src="files/img/game/icons/fame.png" /></button>
                    <button id="button-restart"><img src="files/img/game/icons/restart.png" /></button>
                </div>
                
                <div class="widget">
                    <div id="terminal"></div>
                </div>
                
                <div id="market" class="widget">
                    <div class="widget-row">
                        <span id="label-gold">
                            <label for="controlls-settings-gold-input">
                                <img src="files/img/game/icons/gold.png" />
                                <input type="text" disabled="disabled" size="4" />
                            </label>
                        </span>
                        <input type="text" id="label-quantity" value="0" size="5" disabled="disabled"/>
                    </div>
                    <div class="widget-row">
                        <div id="units-buttonset">
                            <input type="checkbox" id="controlls-unit-chicken" />
                            <label for="controlls-unit-chicken" title="Оборудвано пиле">
                                <img src="files/img/game/icons/chicken.png" />
                                <div class="overlay">
                                    <i>$1</i>
                                </div>
                            </label>
                            <input type="checkbox" id="controlls-unit-mine" />
                            <label for="controlls-unit-mine" title="Солна мина">
                                <img src="files/img/game/icons/mine.png" />
                                <div class="overlay">
                                    <i>$5</i>
                                </div>
                            </label>
                            <input type="checkbox" id="controlls-unit-pig" />
                            <label for="controlls-unit-pig" title="гуци с гърмелка">
                                <img src="files/img/game/icons/pig.png" />
                                <div class="overlay">
                                    <i>$7</i>
                                </div>
                            </label>
                            <input type="checkbox" id="controlls-unit-bomb" />
                            <label for="controlls-unit-bomb" title="Голяма бомба">
                                <img src="files/img/game/icons/bomb.png" />
                                <div class="overlay">
                                    <i>$10</i>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div class="widget-row">
                        <input type="button" id="button-start" value="започни" />
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
