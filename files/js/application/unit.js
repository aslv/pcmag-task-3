function Unit(options) {
    var context = this;

    // Private properties
    var settings = {
        x: 0,
        y: 0,
        type: null,
        range: 1,
        quantity: 1,
        dimensions: 0,
        images: [],
        cost: 0,
        attackPoints: 0,
        changeable: true
    };

    var _cost;
    var _attackPoints;
    var _graphicalUnit;
    var _graphicalArea;


    // Private methods
    function getRandomUnitImage() {
        var image = new Image();
        var randomImage = settings.images[Math.floor(Math.random()* (settings.images.length))];
        image.src = CONST.images[randomImage];
        return image;
    }
    function getProperOpacity(value) {
        return (parseInt(value)) ? Math.log(value, 1000) : 0.1; 
    }
    function handlerQuantityChange (e, value) {
        if (settings.increaseRange) {
            settings.range = (value > 0) ? value : 0.5;
            _graphicalArea.setRadius(settings.range * settings.dimensions);
        } else {
            settings.quantity = value;
            _graphicalArea.setFill(Utilities.buildRgbaColor(settings.color, getProperOpacity(value)));
        }
    }
    
    // Privileged methods
    this.getPosition = function() {
        return {x: settings.x, y: settings.y};
    };
    this.getGridPosition = function() {
        return {x: settings.gridX, y: settings.gridY};
    };
    this.getCost = function() {
        return _cost;
    };
    this.getAttackPoints = function() {
        return _attackPoints;
    };
    this.getType = function() {
        return settings.type;
    };
    this.getQuantity = function() {
        return settings.quantity;
    };
    this.getRange = function() {
        return settings.range;
    };
    this.getUnit = function() {
        return _graphicalUnit;
    };
    this.getArea = function() {
        return _graphicalArea;
    };
    this.getLayer = function() {
        return settings.layer;
    };
    this.setQuantity = function(newQuantity) {
        settings.quantity = newQuantity;
        _attackPoints = newQuantity * 1;
        return context;
    };
    this.setPosition = function(x, y) {
        _graphicalArea.setPosition(x, y);
        _graphicalUnit.setPosition(x - settings.dimensions / 2, y - settings.dimensions / 2);
        settings.x = x;
        settings.y = y;
        // TODO rewrite this
//        settings.gridX = x;
//        settings.gridY = y;
        return context;
    };
    this.setGridPosition = function(x, y) {
        settings.gridX = x;
        settings.gridY = y;
        return context;
    };
    this.setAttrs = function(attrs) {
        _graphicalUnit.setAttrs(attrs);
        _graphicalArea.setAttrs({
            x: attrs.x + settings.dimensions / 2,
            y: attrs.y + settings.dimensions / 2,
            visible: attrs.visible
        });
        return context;
    };
    this.show = function() {
        _graphicalUnit.show();
        _graphicalArea.show();
        return context;
    };
    this.showUnit = function() {
        _graphicalUnit.show();
        return context;
    };
    this.showRange = function() {
        _graphicalArea.show();
        return context;
    };
    this.hide = function() {
        _graphicalUnit.hide();
        _graphicalArea.hide();
        return context;
    };
    this.hideUnit = function() {
        _graphicalUnit.hide();
        return context;
    };
    this.hideRange = function() {
        _graphicalArea.hide();
        return context;
    };
    this.appendToLayer = function(layer) {
        settings.layer = layer;
        layer.add(_graphicalArea)
            .add(_graphicalUnit);
        return context;
    };
    this.enableChangeable = function() {
        settings.changeable = true;
        $(document).on('quantityChange.app', handlerQuantityChange);
    };
    this.disableChangeable = function() {
        settings.changeable = false;
        $(document).off('quantityChange.app');
    };
    this.destroy = function() {
        _graphicalUnit.remove();
        _graphicalArea.remove();
        return context;
    };

    // Constructor
    $.extend(settings, options);
    
    // Range should be atleast 0,5
    settings.range = (settings.range > 0) ? settings.range : 0.5;
    
    if(settings.changeable) {
        $(document).on('quantityChange.app', handlerQuantityChange);
    }
    
    _graphicalUnit = new Kinetic.Image({
        draggable: true,
        visible: false,
        height: settings.dimensions,
        width: settings.dimensions,
        image: getRandomUnitImage()
    });
    _graphicalArea = new Kinetic.Circle({
        visible: false,
        strokeWidth: 2,
        radius: settings.range * settings.dimensions,
        stroke: 'black'
    });
    
    if (!settings.increaseRange) {
        var opacity = getProperOpacity(settings.quantity);
    }
    _graphicalArea.setFill(Utilities.buildRgbaColor(settings.color, opacity));
    
    if(settings.hasOwnProperty('layer')) {
        this.appendToLayer(settings.layer);
    }
    
    if ($.isFunction(settings.attackPoints)) {
        _attackPoints = settings.attackPoints(settings.quantity);
    } else {
        _attackPoints = settings.attackPoints;
    }

    _cost = (settings.increaseRange)
        ? settings.quantity * settings.increaseRangePrice + settings.price
        : settings.quantity * settings.price;
}
