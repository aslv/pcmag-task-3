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
    
    var _navigationGradient;
    var _unitToAdd = null;
    var _unitToAddType = null;
    var _cellDimensions = (settings.dimensions - 2 * settings.offset) / settings.size;
    var _halfDimensions = settings.dimensions / 2;
    
    // Private methods
    /**
     * Create background of screen
     * @returns {Object}
     */
    function buildBackground() {
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
        return background;
    }
    function correctMouseleaveCoordinates(x, y, dimensions) {
        var leftEdge = (dimensions / 2 > x);
        var topEdge = (dimensions / 2 > y);
        var coords = {
            x: x,
            y: y
        };
        
        if (leftEdge && topEdge) {
            if (coords.x < coords.y) {
                coords.x = 0;
            } else {
                coords.y = 0;
            }
        } else if (leftEdge) {
            if (coords.x < dimensions - coords.y) {
                coords.x = 0;
            } else {
                coords.y = dimensions;
            }
        } else if (topEdge) {
            if (dimensions - coords.x < coords.y) {
                coords.x = dimensions;
            } else {
                coords.y = 0;
            }
        } else {
            if (coords.x > coords.y) {
                coords.x = dimensions;
            } else {
                coords.y = dimensions;
            }
        }
        return coords;
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
            }
        } else {
            shape.hide();
            settings.navigationGradientEnabled = true;
        }
        shape.parent.draw();
    }
    function handlerUnitPlacingMousemoveBattlefield(e) {
        _unitToAdd.setAttrs({
            x: e.offsetX - _cellDimensions / 2,
            y: e.offsetY - _cellDimensions / 2,
            visible: true
        });
        _navigationGradient.moveToTop();
        _layerMap.draw();
    }
    function handlerUnitPlacingMouseenterBattlefield(e) {
        $(document).off('click.unitPlacing');
        
    }
    function handlerUnitPlacingMouseleaveBattlefield(e) {
        // Known issue - if you click and strart dragging around the event is being triggered
        var coords = correctMouseleaveCoordinates(e.offsetX, e.offsetY, settings.dimensions);
        _unitToAdd.setPosition(coords.x, coords.y);
        
        $(document).on('click.unitPlacing', function(event) {
            $(document).off('click.unitPlacing');
            _unitToAdd
                .hide()
                .getLayer()
                .draw();
        });
        _layerMap.draw();
    }
    function handlerUnitPlacingClickBattlefield() {
        //    this.getGriddedMapPosition(position) {
//    }
//        var mapX = getGriddedMapPosition(e.offsetX);
//        var mapY = getGriddedMapPosition(e.offsetY);
//        console.log(mapX, mapY)
////            unit.setAbsolutePosition(mapX * _cellDimensions, mapY * _cellDimensions);
        _unitToAdd
            .hideArea()
            .place();
        _layerMap.off('.unitPlacing');
//        layer.draw();
//    });
    }
    function handlerNavigationGradientMousemoveBattlefield(e) {
        updateNavigationGradientSize(_navigationGradient, e.offsetX, e.offsetY);
    }
    function handlerNavigationGradientMouseenterBattlefield(e) {
        $(document).off('click.navigationGradient');
    }
    function handlerNavigationGradientMouseleaveBattlefield(e) {
        var coords = correctMouseleaveCoordinates(e.offsetX, e.offsetY, settings.dimensions);

        updateNavigationGradientSize(_navigationGradient, coords.x, coords.y);

        $(document).on('click.navigationGradient', function(event) {
            $(document).off('click.navigationGradient');
            _navigationGradient
                .hide();
            _navigationGradient.parent
                .draw();
            settings.navigationGradientEnabled = false;
        });
    }
    function handlerAppUnitChange(e, type) {
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
                                
                _layerMap.on('mousemove.unitPlacing', handlerUnitPlacingMousemoveBattlefield);
                _layerMap.on('mouseenter.unitPlacing', handlerUnitPlacingMouseenterBattlefield);
                _layerMap.on('mouseleave.unitPlacing', handlerUnitPlacingMouseleaveBattlefield);
                _layerMap.on('click.unitPlacing', handlerUnitPlacingClickBattlefield);
            }
        } else {
            _unitToAdd.destroy();
            _unitToAdd = null;
            _unitToAddType = null;
            _layerMap.draw();
            _layerMap.off('.unitPlacing');
        }
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
    this.getCellDimensions= function() {
        return _cellDimensions;
    };

    // Constructor
    settings.navigationGradientEnabled = false;
    
    var _navigationGradient = new Kinetic.Circle({
        fillRadialGradientStartRadius: 0,
        fillRadialGradientStartPoint: [0, 0],
        fillRadialGradientEndPoint: [0, 0],
        fillRadialGradientColorStops: [0.6, 'black', 1, 'transparent'],
        fillRadialGradientEndRadius: 1
    });

    _layerMap.on('mousemove.navigationGradient', handlerNavigationGradientMousemoveBattlefield);
    _layerMap.on('mouseenter.navigationGradient', handlerNavigationGradientMouseenterBattlefield);
    _layerMap.on('mouseleave.navigationGradient', handlerNavigationGradientMouseleaveBattlefield);
    
    $(document).bind('unitChange.app', handlerAppUnitChange);

    _layerMap
        .add(buildBackground())
        .add(_navigationGradient);
    _stage.add(_layerMap);
}
Map.prototype = {};
