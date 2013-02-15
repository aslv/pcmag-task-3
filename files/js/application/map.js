function Map(settings) {
    var context = this;

    // Private properties
    var _stage = new Kinetic.Stage({
        container: settings.containerName,
        width: settings.dimensions,
        height: settings.dimensions
    });
    var _layerMap = new Kinetic.Layer();
    var _layerOverlay = new Kinetic.Layer();
    
    var _unitToAdd = null;
    var _unitToAddType = null;
    var _cellDimensions = (settings.dimensions - 2 * settings.offset) / settings.size;
    
    // Private methods
    /**
     * Create background of screen
     * @param {object} layer
     * @returns {null}
     */
    function buildBackground(layer) {
        // Background image
        var image = new Image();
        image.src = settings.images.background;
        var background = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: settings.dimensions,
            height: settings.dimensions,
            cornerRadius: settings.round,
            fillPatternOffset: [0, 0],
            fillPatternImage: image
        });
        layer.add(background);
    }
    
    function buildOverlay(layer) {
        var circle = new Kinetic.Circle({
            fillRadialGradientStartRadius: 0,
            fillRadialGradientStartPoint: [0, 0],
            fillRadialGradientEndPoint: [0, 0],
            fillRadialGradientColorStops: [0.6, 'black', 1, 'transparent'],
            fillRadialGradientEndRadius: 1
        });
        layer.on('mousemove', function(e) {
            var flagX = false;
            var flagY = false;
            var halfDimensions = settings.dimensions / 2;
            var leftEdge = (halfDimensions > e.offsetX);
            var topEdge = (halfDimensions > e.offsetY);
            var edgeDistanceX = halfDimensions - Math.abs(halfDimensions - e.offsetX) - ((leftEdge) ? 0 : 1);
            var edgeDistanceY = halfDimensions - Math.abs(halfDimensions - e.offsetY) - ((topEdge) ? 0 : 1);
            var circleX = e.offsetX;
            var circleY = e.offsetY;
            var radius;
            var radiusByX;
            var radiusByY;
            
            if (edgeDistanceX < edgeDistanceY && edgeDistanceX < settings.offsetNavigation) {
                flagX = true;
                circleX = -edgeDistanceX - 2.5 * settings.offsetNavigation;
                radiusByX = 2 * ((settings.offsetNavigation - edgeDistanceX) + settings.offsetNavigation);
                radius = radiusByX;
                
                // If it's closer to right edge, add the width of battlefield and change the sign
                if(!leftEdge) {
                    circleX = settings.dimensions - circleX;
                }
            }
            if (edgeDistanceY < edgeDistanceX &&  edgeDistanceY < settings.offsetNavigation) {
                flagY = true;
                circleY = -edgeDistanceY - 2.5 * settings.offsetNavigation;
                radiusByY = 2 * ((settings.offsetNavigation - edgeDistanceY) + settings.offsetNavigation);
                radius = (radiusByX) ? Math.max(radiusByX, radiusByY) : radiusByY;
                
                // If it's closer to bottom edge, add the width of battlefield and change the sign
                if(!topEdge) {
                    circleY = settings.dimensions - circleY;
                }
            }
            
            if (flagX || flagY) {
                circle.setAttrs({
                    x: circleX, 
                    y: circleY,
                    radius: radius,
                    fillRadialGradientEndRadius: radius,
                    visible: true
                });
            }
            layer.draw();
        });
        layer.add(circle);
        layer.on('mouseleave', function(e) {
            $(document).on('click.app', function(event) {
                circle.hide();
                layer.draw();
                $(document).off('click.app')
            });
        });
    }

    function buildUnit(layer, type) {
        // Private properties
        var _unitProperties = app.core.getUnitProperties(type);
        var _range;
        var _unit;
        
        // Private methods
        function getRandomUnitImage(type) {
            var image = new Image();
            var randomImage = _unitProperties.images[Math.floor(Math.random()* (_unitProperties.images.length))];
            image.src = CONST.images[randomImage];
            return image;
        }
        function getGriddedMapPosition(position) {
            return Math.round((position - settings.offset) / _cellDimensions);
        }
        
        // Privileged methods
        
        // Constructor
        var _range = new Kinetic.Circle({
//            radius: range * _cellDimensions,
            radius: 2 * _cellDimensions,
            stroke: 'black',
            strokeWidth: 2,
            visible: false
        });
        var _unit = new Kinetic.Image({
            visible: false,
            image: getRandomUnitImage(type),
            width: _cellDimensions,
            height: _cellDimensions,
            draggable: true
        });
        
        layer.on('mousemove.buildUnit', function(e) {
            _unit.setAttrs({
                x: e.offsetX - _cellDimensions / 2,
                y: e.offsetY - _cellDimensions / 2,
                visible: true
            });
            _range.setAbsolutePosition(e.offsetX, e.offsetY);
            _range.show();
            layer.draw();
        });
        layer.on('mouseleave.buildUnit', function(e) {
            _unit.hide();
            _range.hide();
            layer.draw();
        });
        layer.on('click.buildUnit', function(e) {
            var mapX = getGriddedMapPosition(e.offsetX);
            var mapY = getGriddedMapPosition(e.offsetY);
            console.log(mapX, mapY)
//            unit.setAbsolutePosition(mapX * _cellDimensions, mapY * _cellDimensions);
            _range.remove();
            layer.off('mousemove.buildUnit click.buildUnit');
            layer.draw();
        });
        
        layer
            .add(_range)
            .add(_unit)
            .draw();
        return _unit;
    }

    // Privileged methods
    this.getSettings = function() {
        return settings;
    };
    this.getStage = function() {
        return _stage;
    };
    this.getMap = function() {
        return _layerMap;
    };

    // Constructor
    $(document).bind('unitChange.app', function (e, type) {
        if (type) {
            if (type !== _unitToAddType) {
                if (_unitToAdd) {
                    _unitToAdd.remove();
                }
                _unitToAddType = type;
                _unitToAdd = buildUnit(_layerMap, type);
                _unitToAdd.show();
            }
        } else {
            var layer = _unitToAdd.parent;
            _unitToAdd.remove();
            _unitToAdd = null;
            _unitToAddType = null;
            layer.draw();
        }
    });
    
    buildBackground(_layerMap);
    buildOverlay(_layerMap);


    _stage.add(_layerMap);
    _stage.add(_layerOverlay);
}
Map.prototype = {};
