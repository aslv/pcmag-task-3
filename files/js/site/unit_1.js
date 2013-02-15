/**
 * Different units class (pigs, chickens, mines)
 * @param {object} settings
 */
function Unit(settings) {
    var unit = new Kinetic.Rect({
        x: settings.x,
        y: settings.y,
        width: settings.gridSpacing,
        height: settings.gridSpacing,
        fill: '#00D2FF',
        draggable: true
    });

    // Change cursor to pointer on mouseover
    unit.on('mouseover', function(e) {
        document.body.style.cursor = 'pointer';
    });
    unit.on('mouseout', function(e) {
        document.body.style.cursor = 'default';
    });

    // Snap the unit to imaginery grid and prevent dragging outside the canvas
    unit.on('dragmove', function(e) {
        var position = this.getPosition();
        var gridActiveSize = settings.gridSize - 2 * settings.gridOffset;
        var posX = Utilities.toRange(position.x - settings.gridOffset, 0, gridActiveSize);
        var posY = Utilities.toRange(position.y - settings.gridOffset, 0, gridActiveSize);
        var stepsX = Math.round(posX / settings.gridSpacing);
        var stepsY = Math.round(posY / settings.gridSpacing);
        this.attrs.x = stepsX * settings.gridSpacing + settings.gridOffset;
        this.attrs.y = stepsY * settings.gridSpacing + settings.gridOffset;
        
//        if (position.x < settings.gridOffset) {
//            var edge_distance = settings.gridOffset - position.x;
//        } else if (position.x > settings.gridSize) {
//            var edge_distance = position.x - settings.gridSize;
//            console.log()
//        }
//    
//        if (position.y < settings.gridOffset) {
//            console.log(settings.gridOffset - position.y)
//        } else if (position.y > settings.gridSize) {
//            console.log(position.y - settings.gridSize)
//        }
    });
    unit.on('dragend', function(a) {
        this.setDraggable(true);
//        this.attrs.y = Math.round(position.y / settings.gridSpacing) * settings.gridSpacing;
//        layer.draw();
    });

    return unit;
}
