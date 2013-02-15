var CONST = (function() {
     var umad = {
         GRID_SIZE: 100,
         START_GOLD: 200
     };

     return {
        get: function(name) { return umad[name]; }
    };
})();


$(document).ready(function() {
    var application = new Application();
});

function Application() {
    var context = this;
    var _gold = CONST.get('START_GOLD');
    var _units = [];

    var screenSettings = {
        width: 630,
        height: 630,
        gridOffset: 15,
        gridSpacing: 20,
        backgroundRound: 10,
        edgeFadeDuration: 0.5,
        edgeFadeFrom: 0.2,
        edgeFadeTo: 0.8,
        containerName: 'screen-container'
    };
    var imageSources = {
        background: 'files/img/game/screen-bg.jpg'
    };
    var unitProperties = {
        chicken: {
            price: 1,
            range: 2,
            min: 1,
            attackPoints: function(n) {
                return 2 * n - 1;
            }
        },
        pig: {
            price: 7,
            range: 1.5,
            min: 1,
            attackPoints: function(n) {
                return 4 * n;
            }
        },
        mine: {
            price: 6,
            range: 0,
            min: 1,
            max: 1,
            attackPoints: 0,
        },
        bomb: {
            price: 10,
            range: 0,
            min: 0,
            attackPoints: -1,
            resizeRange: true
        }
    };

    // Private methods
    /**
     * Preload all images
     * @param {object} sources
     * @param {function} callback
     * @returns {null}
     */
    function loadImages(sources, callback) {
        var images = {};
        var sourcesLength = 0;
        var sourcesLoaded = 0;
        for (var src in sources)
            sourcesLength++;
        for (var src in sources) {
            images[src] = new Image();
            images[src].onload = function() {
                if (++sourcesLoaded >= sourcesLength) {
                    callback(images);
                }
            };
            images[src].src = sources[src];
        }
    }
    /**
     * Starts game's screen
     * @param {object} images
     * @returns {null}
     */
    function startScreen(images) {
        screenSettings.images = images;
        var screen = new Screen(context, screenSettings);
    }


    // Privileged methods
    /**
     * Getter of current gold
     * @return {Number}
     */
    this.getGold = function() {
        return _gold;
    };
    /**
     * Setter of current gold
     * @param {Number} value
     * @returns {Void}
     */
    this.setGold = function(value) {
        _gold = value;
    };
    this.payGold = function(value) {
        var newGold = _gold - value;
        if (newGold >= 0) {
            _gold = newGold;
            return true;
        } else {
            return false;
        }
    };
    /**
     * Getter of unit propertires
     * @return {Object}
     */
    this.getUnitProperties = function() {
        return unitProperties;
    };
    this.addUnit = function (type, positionX, positionY, quantity) {
        // Check if there is such a unit type
        if ( !unitProperties.hasOwnProperty(type)) {
            return false;
        }

        var settings = unitProperties[type];
        settings.x = positionX;
        settings.y = positionY;
        settings.type = type;
        settings.quantity = (typeof quantity === 'number') ? settings.quantity : 1;

        var unit = new Unit(settings);

        if (context.payGold(unit.getValue())) {
            _units.push(unit);
        } else {
            return false;
        }
    };

    this.addUnit('pig', 10, 10, 10);







    loadImages(imageSources, startScreen);
    var widgets = new Widgets(this);
}
Application.prototype = {
};

lang = {
    termInvalidArgument: 'Invalid argument `%s` in `%s`\nType `help` for more information\n',
    termUnknownCommand: 'Unknown command `%s`\nType `help -c` to list all commands\n',
    termHelpCommands: 'Full list of commands\n',
    termHelp: 'Type `help` to see this list again',
    termHelpRules: 'Hi',
    argQuantity: 'Number of elements',
    argCoordinateX: 'Coordinates in X axis',
    argCoordinateY: 'Coordinates in Y axis'
}
