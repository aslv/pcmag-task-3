window.Utilities = (function() {
    function Utilities(els) {
        /**
         * Checks if value is in range
         * @param {Number} value
         * @param {Number} min
         * @param {Number} max
         * @returns {Boolean}
         */
        this.inRange = function(value, min, max) {
            return !!(value >= min && value <= max);
        };
        /**
         * Checks is value in range and if it's above, return max value, else if
         * below returns minimum, else return the value itself
         * @param {Number} value
         * @param {Number} min
         * @param {Number} max
         * @returns {Number}
         */
        this.toRange = function(value, min, max) {
            return (value > min) ? ((value < max) ? value : max) : min;
        };
        /**
         * Merges passed objects and the last objects overwrite previous ones
         * @returns {Object} merged object
         */
        this.mergeObjects = function() {
            var object = {};
            if (arguments.length) {
                for (var passed_obj in arguments) {
                    if (arguments[passed_obj] instanceof Object) {
                        for (var key in arguments[passed_obj]) {
                            object[key] = arguments[passed_obj][key];
                        }
                    } else {
                        return false;
                    }
                }
                return object;
            }
            return false;
        };
        /**
         * Replace empty placeholders in given pattern
         * @param {String} pattern
         * @param {String} placeholders
         * @return {String}
         */
        this.textPattern = function() {
            var placeholders = $.makeArray(arguments);
            var pattern = placeholders.shift();
            var result = pattern;

            for (var i in placeholders) {
                result = result.replace(/%s/, placeholders[i]);
            }
            return result;
        };
    }
    return new Utilities;
}());
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}