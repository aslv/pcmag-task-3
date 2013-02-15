function Widgets(appInstance) {
    var context = this;

    function controlls() {
        // <editor-fold `>
        var unitsContainer = $('#controlls-units-container');
        var unitsButtonset = $('#controlls-units-buttonset');
        var unitsCheckboxes = unitsButtonset.find('input');
        var unitChicken = $('#controlls-unit-chicken');
        var unitMine = $('#controlls-unit-mine');
        var unitPig = $('#controlls-unit-pig');
        var unitBomb = $('#controlls-unit-bomb');
        var settingsQuantity = $('#controlls-settings-quantity');
        var settingsGold = $('#controlls-settings-gold-inputa');
        var buttonStart = $('#controlls-button-start');
        // </editor-fold>
        var currentUnit = null;
        var settingsQuantityDefault = settingsQuantity.attr('value');
        var unitProperties = appInstance.getUnitProperties();

        /**
         * Get unit type by checked checkbox
         * @param {Object} checkbox
         * @returns {String}
         */
        function getUnitType(checkbox) {
            switch (checkbox) {
                case unitChicken.get(0) :
                    return 'chicken';
                case unitMine.get(0) :
                    return 'mine';
                case unitPig.get(0) :
                    return 'pig';
                case unitBomb.get(0) :
                    return 'bomb';
            }
        }

        /**
         * Refresh settings inputs
         * @returns {Void}
         */
        function refreshSettings() {
            settingsQuantity
                .spinner('value', settingsQuantityDefault);

            settingsGold
                .val(appInstance.getGold());
        }

        function updateGold(quantity) {
            // If we range is resizable, then there is at least one unit bougth
            quantity += (unitProperties[currentUnit].resizeRange) ? 1 : 0;
            // How much gold will left after adding current number of units
            var goldLeft = appInstance.getGold() - unitProperties[currentUnit].price * quantity;
            if (goldLeft >= 0) {
                // If number is positive, update gold indicator
                settingsGold.val(goldLeft);
            } else {
                // Else don't change the quantity
                return false;
            }
        }

        // Binding events
        unitsCheckboxes
            .on('change', function() {
                // If any of checkboxes is changed
                var $this = $(this);
                // Get current unit type
                currentUnit = getUnitType(this);

                refreshSettings();

                if ($this.prop('checked')) {
                    // If changed checkbox is checked then uncheck all checkboxes except the current one
                    unitsCheckboxes
                        .not(this)
                        .each(function() {
                            $(this)
                                .prop('checked', false)
                                .button('refresh');
                        });

                    // Disable spinner if max and min are the same
                    settingsQuantity
                        .spinner('option', {
                            disabled: (unitProperties[currentUnit].max) ? !(unitProperties[currentUnit].max - unitProperties[currentUnit].min) : false,
                            min: unitProperties[currentUnit].min,
                            max: unitProperties[currentUnit].max
                        })
                        .spinner('value', unitProperties[currentUnit].min);

                    updateGold(unitProperties[currentUnit].min);
                } else {
                    currentUnit = null;
                    settingsQuantity
                        .spinner('disable')
                        .spinner('option', 'min', 0);
                }
            });


        settingsQuantity
            .on('focus', function(e) {
                // Disable focus on quantity input
                $(this).blur();
            })
            .spinner({
                disabled: true,
                min: 0,
                spin: function(e, ui) {
                    return updateGold(ui.value);
                }
            });

        // Add styles to gold indicator
        settingsGold
            .addClass('ui-spinner-input')
            .closest('span')
            .addClass('ui-widget ui-widget-content ui-corner-all ui-spinner');

        unitsButtonset.buttonset();
        buttonStart.button();
    }

    controlls();
    CommandIntereter(appInstance);
}

Widgets.prototype = {
};