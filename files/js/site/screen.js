function Screen(siteInstance, settings) {
    var context = this;

    var stage = new Kinetic.Stage({
        container: settings.containerName,
        width: settings.width,
        height: settings.height
    });

    var layerBackground = new Kinetic.Layer();
    var layerMap = new Kinetic.Layer();

    // Private methods
    /**
     * Create background of screen
     * @param {object} layer
     * @returns {null}
     */
    function buildBackground(layer) {
        // Background image
        var background = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: settings.width,
            height: settings.height,
            cornerRadius: settings.backgroundRound,
            fillPatternOffset: [0, 0],
            fillPatternImage: settings.images.background
        });

        /**
         * Build map edge
         * @param {string} type
         * @param {object} options
         * @returns {object|boolean}
         */
        function buildEdge(type, options) {
            var options = options || {};
            var edge = new Kinetic.Shape(Utilities.mergeObjects({
                    drawFunc: function(canvas) {
                        var context = canvas.getContext();
                        context.beginPath();
                        context.moveTo(settings.backgroundRound, 0);
                        context.lineTo(settings.width - settings.backgroundRound, 0);
                        context.arc(settings.width - settings.backgroundRound, settings.backgroundRound, settings.backgroundRound, Math.PI * 1.5, Math.PI * 1.75);
                        context.lineTo(settings.width - settings.gridOffset, settings.gridOffset);
                        context.lineTo(settings.gridOffset, settings.gridOffset);
                        context.arc(settings.backgroundRound, settings.backgroundRound, settings.backgroundRound, Math.PI * 1.25, Math.PI * 1.5);
                        context.closePath();
                        canvas.fillStroke(this);
                    },
                    opacity: settings.edgeFadeFrom,
                    fillLinearGradientStartPoint: [0, settings.gridOffset / 3],
                    fillLinearGradientEndPoint: [0, settings.gridOffset],
                    fillLinearGradientColorStops: [0, 'black', 1, 'transparent']
                }, options)
            );

            // positionProp holds property names to calculate pixelsEntered later
            if (type === 'vertical') {
                var positionProp = {
                    offset : 'offsetX',
                    coords : 'x'
                };
            } else if (type === 'horizontal') {
                var positionProp = {
                    offset : 'offsetY',
                    coords : 'y'
                };
            } else {
                return false;
            }

            // Coeficient to increase the opacity on hover
            var opacityCoef = (settings.edgeFadeTo - settings.edgeFadeFrom) / settings.gridOffset;

            // Bind events
            edge.on('mousemove', function(e) {
                var pixelsEntered  = settings.gridOffset - Math.abs(e[positionProp.offset] - e.shape.attrs[positionProp.coords]);
                this.transitionTo({
                    opacity: opacityCoef * pixelsEntered + settings.edgeFadeFrom,
                    duration: settings.edgeFadeDuration,
                    easing: 'ease-out'
                });
            });
            edge.on('mouseover', function() {
                document.body.style.cursor = 'move';
            });
            edge.on('mouseleave', function() {
                document.body.style.cursor = 'default';
                this.transitionTo({
                    opacity: settings.edgeFadeFrom,
                    duration: settings.edgeFadeDuration,
                    easing: 'ease-in'
                });
            });
            return edge;
        }

        /**
         * Build map corner
         * @param {array} simulateElements
         * @param {object} options
         * @return {object}
         */
        function buildCorner(simulateElements, options) {
            var options = options || {};
            var corner = new Kinetic.Shape(Utilities.mergeObjects({
                    drawFunc: function(canvas) {
                        var context = canvas.getContext();
                        context.beginPath();
                        context.moveTo(settings.backgroundRound, 0);
                        context.lineTo(settings.gridOffset, 0);
                        context.lineTo(settings.gridOffset, settings.gridOffset);
                        context.lineTo(0, settings.gridOffset);
                        context.lineTo(0, settings.backgroundRound);
                        context.arc(settings.backgroundRound, settings.backgroundRound, settings.backgroundRound, Math.PI, Math.PI * 1.5);
                        context.closePath();
                        canvas.fillStroke(this);
                    }
                }, options)
            );

            // Bind events
            corner.on('mouseover', function() {
                for (var index in simulateElements) {
                    simulateElements[index].simulate('mouseover');
                }
            });
            corner.on('mousemove', function(e) {
                for (var index in simulateElements) {
                    simulateElements[index].simulate('mousemove', e);
                }
            });
            corner.on('mouseleave', function() {
                for (var index in simulateElements) {
                    simulateElements[index].simulate('mouseleave');
                }
            });
            return corner;
        }

        // Create edges
        var edgeTop = buildEdge('horizontal');
        var edgeLeft = buildEdge('vertical', {
            rotation: Math.PI * 1.5,
            y: settings.height
        });
        var edgeRight = buildEdge('vertical', {
            rotation: Math.PI * 0.5,
            x: settings.width
        });
        var edgeBottom = buildEdge('horizontal', {
            rotation: Math.PI,
            x: settings.width,
            y: settings.height
        });

        // Create corners
        var cornerTopLeft = buildCorner([edgeTop, edgeLeft]);
        var cornerTopRight = buildCorner([edgeTop, edgeRight], {
            x: settings.width,
            rotation: Math.PI * 0.5
        });
        var cornerBottomLeft = buildCorner([edgeBottom, edgeLeft], {
            y: settings.height,
            rotation: Math.PI * 1.5
        });
        var cornerBottomRight = buildCorner([edgeBottom, edgeRight], {
            x: settings.width,
            y: settings.height,
            rotation: Math.PI
        });

        layer.add(background);
        layer.add(edgeTop);
        layer.add(edgeLeft);
        layer.add(edgeBottom);
        layer.add(edgeRight);
        layer.add(cornerTopLeft);
        layer.add(cornerTopRight);
        layer.add(cornerBottomLeft);
        layer.add(cornerBottomRight);
    }

    // Privileged methods
    this.getSettings = function() {
        return settings;
    };
    this.getStage = function() {
        return stage;
    };
    this.getMap = function() {
        return layerMap;
    };

    // Method calls
    buildBackground(layerBackground);
    this.init();

    stage.add(layerBackground);
    stage.add(layerMap);
}
Screen.prototype = {
    init: function() {
        var context = this;
        var settings = this.getSettings();
        var unitSettings = {
            x: settings.gridOffset,
            y: settings.gridOffset,
            gridSpacing: settings.gridSpacing,
            gridOffset: settings.gridOffset,
            gridSize: 600,
            type: 'pig'
        };
    }
};
