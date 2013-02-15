(function() { 
    var images = {};
    function Application() {
        var $app;

        this.show = function () {
            $app.show();
        };
        this.hide = function () {
            $app.hide();
        };
        $(document).imageLoader({
            images: $.map(CONST.images, function (value, key) { return value; }),
            async: true,
            start: function (e, ui) {

            },
            complete: function (e, ui) {
//                console.log(5);
            },
            error: function (e, ui) {
                alert('failed loading image');
            },
            allcomplete: function (e,  ui) {
                $app = $('#application');
                allcompleteCallback(e,  ui);
            }
        });
    }
    function allcompleteCallback(e, ui) {
        app.core = new Core();
        app.market = new Market();
        app.terminal = new Terminal();
        $('#button-info').button();
        $('#button-fame').button();
        $('#button-restart').button();
    }
    app = new Application();
}());

function Core() {
    var context = this;

    // Private properties
    var _gold = CONST.gold;
    var _grid = [];
    var _map;

    // Private methods

    // Privileged methods
    /**
     * Get gold
     */
    this.getGold = function() {
        return _gold;
    };

    /**
     * Decrease gold with given value and return the new value
     * @param {Number} val
     * @returns {Number}
     */
    this.decreaseGold = function(val) {
        if (_gold - val < 0) {
            return false;
        }
        _gold -= val;
        $(document).trigger('goldChange.app', [_gold]);
        return _gold;
    };

    /**
     * Retrun unit's properties of given type
     * @param {String} type
     * @returns {Object}
     */
    this.getUnitProperties = function(type) {
        var result = $.grep(CONST.units, function (elem, index) {
            return elem.type === type;
        });
        return (result.length) ? result[0] : {};
    };

    this.getCoordinates = function(x, y) {
        return $.grep(_grid, function(elem, index) {
            var position = elem.getPosition();
            return position.x === x && position.y === y;
        });
    };

    this.setNewUnit = function(type, x, y, quantity) {
        var quantity = (typeof quantity === 'undefined') ? 1 : quantity;
        var unitProperties = context.getUnitProperties(type);
        var newUnit = new Unit({
            x: x,
            y: y,
            type: type,
            quantity: quantity,
            price: unitProperties.price,
            range: unitProperties.range,
            increaseRangePrice: unitProperties.increaseRangePrice,
            increaseRange: unitProperties.increaseRange,
            attackPoints: unitProperties.attackPoints
        });
        var errors = [];

        if (x < 0 || x >= CONST.gridSize || y < 0 || y >= CONST.gridSize) {
            errors.push('extramural');
        }
        if (_gold - newUnit.getCost() < 0) {
            errors.push('overcost');
        }
        if (context.getCoordinates(x, y).length) {
            errors.push('overlap');
        }
        if ( !errors.length) {
            context.decreaseGold(newUnit.getCost());
            _grid.push(newUnit);
            return true;
        }
        return errors;
    };

    // Constructor
    _map = new Map({
        size : CONST.mapSize,
        dimensions : CONST.mapDimensions,
        offset : CONST.mapOffset,
        offsetNavigation : CONST.mapOffsetNavigation,
        round : CONST.borderRadius,
        containerName: 'battlefield-container',
        images: {
            background: CONST.images.background
        }
    });

    $(document).bind('goldChange.app', function (e, gold) {
        console.log(gold)
    });
};
