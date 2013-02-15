function Unit(settings) {
    var context = this;

    // Private properties
    var _x = settings.x;
    var _y = settings.y;
    var _type = settings.type;
    var _price = settings.price;
    var _range = settings.range;
    var _quantity = settings.quantity;
    var _cost;
    var _attackPoints;

    // Private methods
    //
    // Privileged methods
    this.getPosition = function() {
        return {x: _x, y: _y};
    };
    this.setPosition = function(x, y) {
        _x = x;
        _y = y;
    };
    this.translatePosition = function(x, y) {
        _x += x;
        _y += y;
    };
    this.getCost = function() {
        return _cost;
    };
    this.getAttackPoints = function() {
        return _attackPoints;
    };
    this.getType = function() {
        return _type;
    };
    this.getQuantity = function() {
        return _quantity;
    };
    this.setQuantity = function(newQuantity) {
        _quantity = newQuantity;
        _attackPoints = newQuantity * 1;
    };

    // Constructor
    if ($.isFunction(settings.attackPoints)) {
        _attackPoints = settings.attackPoints(settings.quantity);
    } else {
        _attackPoints = settings.attackPoints;
    }

    _cost = (settings.increaseRange)
        ? settings.quantity * settings.increaseRangePrice + settings.price
        : settings.quantity * settings.price;
}
