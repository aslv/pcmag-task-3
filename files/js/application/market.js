function Market() {
    // <editor-fold>
    var $unitsButtonset = $('#units-buttonset');
    var $unitsCheckboxes = $unitsButtonset.find('input');
    var $unitChicken = $('#controlls-unit-chicken');
    var $unitMine = $('#controlls-unit-mine');
    var $unitPig = $('#controlls-unit-pig');
    var $unitBomb = $('#controlls-unit-bomb');
    var $quantityLabel = $('#label-quantity');
    var $goldLabel = $('#label-gold').find('input');
    var $buttonStart = $('#button-start');
    // </editor-fold>
    var _unitProperties = null;
    
    // Private methods
    /**
     * Get checked unit type by checked checkbox
     * @param {Object} checkbox
     * @returns {String}
     */
    function getUnitType(checkbox) {
        switch (checkbox) {
            case $unitChicken.get(0) :
                return 'chicken';
            case $unitMine.get(0) :
                return 'mine';
            case $unitPig.get(0) :
                return 'pig';
            case $unitBomb.get(0) :
                return 'bomb';
        }
    }

    /**
     * Refresh settings inputs
     * @returns {Void}
     */
    function refreshSettings() {
        $quantityLabel.spinner('value', 0);
        $goldLabel.val(app.core.getGold());
    }

    /**
     * Update the value of gold label
     * @param {Number} quantity
     * @returns {Boolean}
     */
    function updateGoldLabel(quantity) {
        // How much gold will left after adding current number of units
        var goldLeft = app.core.getGold() - _unitProperties.cost(quantity);

        // If number is positive, update gold indicator
        if (goldLeft >= 0) {
            
            $goldLabel.val(goldLeft);
            return true;
        }
        return false;
    }

    /**
     * Get unit properties and return them formatted
     * @param {String} type
     */
    function getUnitProperties(type) {
        var unitProperties = app.core.getUnitProperties(type);
        var properties = {
            type: type
        };

        if (unitProperties.min === unitProperties.max && !unitProperties.increaseRange) {
            properties.disableSpinner = true;
        } else {
            properties.disableSpinner = false;
        }
        if (unitProperties.increaseRange) {
            properties.min = unitProperties.range;
            properties.cost = function (n) {
                return n * unitProperties.increaseRangePrice + unitProperties.price;
            };
        } else {
            properties.min = unitProperties.min;
            properties.cost = function (n) {
                return n * unitProperties.price;
            };
        }
        return properties;
    }

    // Constructor
    $goldLabel.val(app.core.getGold());
    $(document).bind('goldChange.app', function (e, gold) {
        $goldLabel.val(gold);
    });

    $unitsCheckboxes.on('change', function() {
        // If any of checkboxes is changed
        var $this = $(this);

        refreshSettings();

        // If changed checkbox is checked
        if ($this.prop('checked')) {
            var unitType = getUnitType(this);
            _unitProperties = getUnitProperties(unitType);
            $(document).trigger('unitChange.app', [unitType]);

            // Uncheck all checkboxes except the current one
            $unitsCheckboxes
                .not(this)
                .each(function() {
                    $(this)
                        .prop('checked', false)
                        .button('refresh');
                });


            $quantityLabel
                .spinner('option', {
                    disabled: _unitProperties.disableSpinner,
                    min: _unitProperties.min
                })
                .spinner('value', _unitProperties.min);

            // TODO prevent decreasing gold when it's critically low
            updateGoldLabel(_unitProperties.min);
        } else {
            _unitProperties = null;
            $(document).trigger('unitChange.app');
            $quantityLabel
                .spinner('disable')
                .spinner('option', 'min', 0)
                .spinner('value', 0);
        }
    });

    $quantityLabel
        .on('focus', function(e) {
            // Disable focus on quantity input
            $(this).blur();
        })
        .spinner({
            disabled: true,
            incremental: false,
            min: 0,
            spin: function(e, ui) {
                return updateGoldLabel(ui.value);
            }
    });

    // Add styles to gold indicator
    $goldLabel
            .addClass('ui-spinner-input')
            .closest('span')
            .addClass('ui-widget ui-widget-content ui-corner-all ui-spinner');

    $unitsButtonset.buttonset();
    $buttonStart.button();
}