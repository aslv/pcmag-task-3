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
    var _halfDimensions = settings.dimensions / 2;
    
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
    function updateNavigationGradientSize(shape, offsetX, offsetY) {
        var flagX = false;
        var flagY = false;
        var leftEdge = (_halfDimensions > offsetX);
        var topEdge = (_halfDimensions > offsetY);
        var edgeDistanceX = _halfDimensions - Math.abs(_halfDimensions - offsetX) - ((leftEdge) ? 0 : 1);
        var edgeDistanceY = _halfDimensions - Math.abs(_halfDimensions - offsetY) - ((topEdge) ? 0 : 1);
        var circleX = offsetX;
        var circleY = offsetY;
        var radius;
        var radiusByX;
        var radiusByY;

        if (edgeDistanceX < edgeDistanceY && edgeDistanceX < settings.offsetNavigation) {
            flagX = true;
            circleX = -edgeDistanceX - 2.5 * settings.offsetNavigation;
            radiusByX = 2 * ((settings.offsetNavigation - edgeDistanceX) + settings.offsetNavigation);
            radius = radiusByX;

            // If it's closer to right edge, add the width of battlefield and change the sign
            if (!leftEdge) {
                circleX = settings.dimensions - circleX;
            }
        }
        if (edgeDistanceY < edgeDistanceX && edgeDistanceY < settings.offsetNavigation) {
            flagY = true;
            circleY = -edgeDistanceY - 2.5 * settings.offsetNavigation;
            radiusByY = 2 * ((settings.offsetNavigation - edgeDistanceY) + settings.offsetNavigation);
            radius = (radiusByX) ? Math.max(radiusByX, radiusByY) : radiusByY;

            // If it's closer to bottom edge, add the width of battlefield and change the sign
            if (!topEdge) {
                circleY = settings.dimensions - circleY;
            }
        }

        if (flagX || flagY) {
            if (settings.navigationGradientEnabled) {
                shape.setAttrs({
                    x: circleX,
                    y: circleY,
                    radius: radius,
                    fillRadialGradientEndRadius: radius,
                    visible: true
                });
                shape.parent.draw();
            }
        } else {
            shape.hide();
            settings.navigationGradientEnabled = true;
        }
    }
    function buildOverlay(layer) {
        var circle = new Kinetic.Circle({
            fillRadialGradientStartRadius: 0,
            fillRadialGradientStartPoint: [0, 0],
            fillRadialGradientEndPoint: [0, 0],
            fillRadialGradientColorStops: [0.6, 'black', 1, 'transparent'],
            fillRadialGradientEndRadius: 1
        }); 
        layer.add(circle);
        
        layer.on('mousemove.navigationGradient', function(e) {
            updateNavigationGradientSize(circle, e.offsetX, e.offsetY);
        });
        layer.on('mouseleave.navigationGradient', function(e) {
            var leftEdge = (_halfDimensions > e.offsetX);
            var topEdge = (_halfDimensions > e.offsetY);
            var x = e.offsetX;
            var y = e.offsetY;
            if (leftEdge && topEdge) {
                if(x < y) {
                    x = 0;
                } else {
                    y = 0;
                }
            } else if(leftEdge){
                if(x < settings.dimensions - y) {
                    x = 0;
                } else {
                    y = settings.dimensions;
                }
            } else if(topEdge) {                
                if(settings.dimensions - x < y) {
                    x = settings.dimensions;
                } else {
                    y = 0;
                }
            } else {
                if(x > y) {
                    x = settings.dimensions;
                } else {
                    y = settings.dimensions;
                }
            }

            updateNavigationGradientSize(circle, x, y);
                    
            $(document).on('click.navigationGradient', function(event) {
                circle.hide();
                layer.draw();
                settings.navigationGradientEnabled = false;
                $(document).off('click.navigationGradient')
            });
        });
    }

    function handlerMapMousemoveUnitPlacing(e) {
        _unitToAdd.setAttrs({
            x: e.offsetX - _cellDimensions / 2,
            y: e.offsetY - _cellDimensions / 2,
            visible: true
        });
        _layerMap.draw();
    }
    function handlerMapMouseleaveUnitPlacing(e) {
        _unitToAdd.hide();
        _layerMap.draw();
    }
//    function getGriddedMapPosition(position) {
//        return Math.round((position - settings.offset) / _cellDimensions);
//    }
//    layer.on('click.buildUnit', function(e) {
//        var mapX = getGriddedMapPosition(e.offsetX);
//        var mapY = getGriddedMapPosition(e.offsetY);
//        console.log(mapX, mapY)
////            unit.setAbsolutePosition(mapX * _cellDimensions, mapY * _cellDimensions);
//        _range.remove();
//        layer.off('mousemove.buildUnit click.buildUnit');
//        layer.draw();
//    });

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
    this.getCellDimensions= function() {
        return _cellDimensions;
    };

    // Constructor
    settings.navigationGradientEnabled = false;
    
    // On unit change
    $(document).bind('unitChange.app', function (e, type) {
        // If there is selected type
        if (type) {
            var flag = false;
            // If the new unit would different from previous one
            if (_unitToAdd && type !== _unitToAdd.getType()) {
                _unitToAdd.destroy();
                flag = true;
            // If there wasn't previous one
            } else if (!_unitToAdd) {
                flag = true;
            }
            
            if (flag) {
                _unitToAdd = app.core.createNewUnit(type, {
                    dimensions: _cellDimensions,
                    quantity: app.market.getQuantity(),
                    layer: _layerMap
                });
                _unitToAdd.show();
                
                _layerMap.on('mousemove.unitPlacing', handlerMapMousemoveUnitPlacing);
                _layerMap.on('mouseleave.unitPlacing', handlerMapMouseleaveUnitPlacing);
            }
        } else {
            _unitToAdd.destroy();
            _unitToAdd = null;
            _unitToAddType = null;
            _layerMap.draw();
            _layerMap.off('.unitPlacing');
        }
    });
    
    buildBackground(_layerMap);
    buildOverlay(_layerMap);

    _stage.add(_layerMap);
    _stage.add(_layerOverlay);
}
Map.prototype = {};
